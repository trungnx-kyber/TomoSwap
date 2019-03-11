import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as transferActions from '../actions/transferAction'
import * as txActions from "../actions/transactionAction";
import { numberToHex } from "../utils/helpers";
import { getTransferABI } from "../services/networkService";
import appConfig from "../config/app";
import {TOMO} from "../config/tokens";

const getTransfertate = state => state.transfer;
const getAccountState = state => state.account;

function *transfer() {
  const transfer = yield select(getTransfertate);
  const account = yield select(getAccountState);
  const web3 = account.web3;
  const srcToken = transfer.sourceToken;
  const srcAmount = numberToHex(transfer.sourceAmount, srcToken.decimals);
  const isTransferTOMO = srcToken.symbol === TOMO.symbol;

  try {

    const gasPrice = yield call(web3.eth.getGasPrice);
    // const nonce = yield call(web3.eth.getTransactionCount, account.address);

    const txObject = {
      from: account.address,
      to: transfer.toAddress,
      value: srcAmount,
      gasPrice: gasPrice,
      // gas: appConfig.DEFAULT_GAS,
      // nonce: nonce,
      // chainId: chainId
      // gasLimit: gas,
    };

    if (!isTransferTOMO) {
      txObject.data = yield call(getTransferABI, {
        srcAddress: srcToken.address,
        srcAmount: srcAmount,
        toAddress: transfer.toAddress,
      });
      txObject.to = srcToken.address;
      txObject.value = '0x0';
    }

    const txHash = yield call(account.walletService.sendTransaction, txObject);
    yield put(txActions.setTxHash(txHash));
    let isTxMined = false;

    while(!isTxMined) {
      yield call(delay, appConfig.TX_TRACKING_INTERVAL);
      const txReceipt = yield call(web3.eth.getTransactionReceipt, txHash);

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

export default function* transferWatcher() {
  yield takeLatest(transferActions.transferActionTypes.TRANSFER, transfer);
}
