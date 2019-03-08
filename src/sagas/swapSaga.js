import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSwapABI, getRate } from "../services/networkService";
import * as swapActions from "../actions/swapAction";
import * as txActions from "../actions/transactionAction";
import {
  calculateMinConversionRate,
  formatBigNumber,
  getBiggestNumber,
  numberToHex
} from "../utils/helpers";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { sendTx, trackTx } from "../services/accountService";
import { TOMO } from "../config/tokens";
import { getWeb3Instance } from "../services/web3Service";

const getSwapState = state => state.swap;
const getAccountState = state => state.account;

function *swapToken() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const srcToken = swap.sourceToken;
  const srcAmount = numberToHex(swap.sourceAmount, srcToken.decimals);
  const minConversionRate = calculateMinConversionRate(appConfig.DEFAULT_SLIPPAGE_RATE, swap.tokenPairRate);

  try {
    const swapABI = yield call(getSwapABI, {
      srcAddress: srcToken.address,
      srcAmount: srcAmount,
      destAddress: swap.destToken.address,
      address: account.address,
      maxDestAmount: getBiggestNumber(),
      minConversionRate: minConversionRate,
      walletId: appConfig.DEFAULT_WALLET_ID
    });

    const web3 = getWeb3Instance();
    const gasPrice = yield call(web3.eth.getGasPrice);
    // const nonce = yield call(web3.eth.getTransactionCount, account.address);

    const txObject = {
      from: account.address,
      to: envConfig.NETWORK_PROXY_ADDRESS,
      value: srcToken.symbol === TOMO.symbol ? srcAmount : '0x0',
      gas: appConfig.DEFAULT_GAS,
      gasPrice: gasPrice,
      data: swapABI,
      // nonce: nonce,
    };

    const txHash = yield call(sendTx, account.walletType, txObject);
    yield put(txActions.setTxHash(txHash));
    let isTxMined = false;

    while(!isTxMined) {
      yield call(delay, appConfig.TX_TRACKING_INTERVAL);
      const txReceipt = yield call(trackTx, txHash);

      if (txReceipt.status === '0x1') {
        yield put(txActions.setIsTxMined(txReceipt.status));
        isTxMined = true;
      } else if (txReceipt.status === '0x0') {
        yield put(txActions.setTxError("There is something wrong with the transaction!"));
        isTxMined = true;
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

function *fetchTokenPairRateWithInterval() {
  yield call(fetchTokenPairRate);
  while(true) {
    yield call(delay, appConfig.TOKEN_PAIR_RATE_INTERVAL);
    yield call(fetchTokenPairRate, false);
  }
}

function *fetchTokenPairRate(showDestAmountLoading = false) {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const srcToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;
  const isValidInput = yield call(validateValidInput, swap, account);

  if (!isValidInput) return;

  yield put(swapActions.setTokenPairRateLoading(true));
  yield put(swapActions.setIsDestAmountLoadingShown(showDestAmountLoading));

  try {
    let { expectedRate } = yield call(getRate, srcToken.address, srcToken.decimals, destToken.address, sourceAmount);

    if (!+expectedRate) {
      yield put(swapActions.setError(`Your source amount exceeds our max capacity`));
    }

    expectedRate = formatBigNumber(expectedRate);
    const destAmount = expectedRate * sourceAmount;

    yield put(swapActions.setDestAmount(destAmount));
    yield put(swapActions.setTokenPairRate(expectedRate));
  } catch (e) {
    console.log(e);
  }

  yield put(swapActions.setTokenPairRateLoading(false));
  if (showDestAmountLoading) {
    yield put(swapActions.setIsDestAmountLoadingShown(false));
  }
}

function *validateValidInput(swap, account) {
  const isAccountImported = !!account.address;
  const sourceToken = swap.sourceToken;
  const sourceAmount = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.decimals;
  const sourceAmountDecimals = sourceAmount.split(".")[1];

  yield put(swapActions.setError(''));

  if (swap.sourceToken.symbol === swap.destToken.symbol) {
    yield call(setError, 'Cannot exchange the same token');
    return false;
  }

  if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield call(setError, `Your source amount's decimals should be no longer than ${sourceTokenDecimals} characters`);
    return false;
  }

  if (isAccountImported && sourceAmount > sourceToken.balance) {
    yield call(setError, 'Your source amount is bigger than your real balance');
    return false;
  }

  if (sourceAmount !== '' && !+sourceAmount) {
    yield call(setError, 'Your source amount is invalid');
    return false;
  }

  return true;
}

function *setError(errorMessage) {
  yield put(swapActions.setError(errorMessage));
  yield put(swapActions.setTokenPairRateLoading(false));
  yield put(swapActions.setTokenPairRate(0));
  yield put(swapActions.setDestAmount(0));
}

export default function* swapWatcher() {
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRateWithInterval);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
}
