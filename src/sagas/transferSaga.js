import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as transferActions from '../actions/transferAction'
import * as txActions from "../actions/transactionAction";
import { numberToHex } from "../utils/helpers";
import { getTransferABI } from "../services/networkService";
import { TOMO } from "../config/tokens";
import { fetchTransactionReceipt, getTxObject } from "./transactionSaga";

const getTransfertate = state => state.transfer;
const getAccountState = state => state.account;

function *transfer() {
  const transfer = yield select(getTransfertate);
  const account = yield select(getAccountState);
  const srcToken = transfer.sourceToken;
  const srcAmount = numberToHex(transfer.sourceAmount, srcToken.decimals);
  const isTransferTOMO = srcToken.symbol === TOMO.symbol;

  try {
    let txTo, txValue, txData;

    if (isTransferTOMO) {
      txTo = transfer.toAddress;
      txValue = srcAmount;
    } else {
      txData = yield call(getTransferABI, {
        srcAddress: srcToken.address,
        srcAmount: srcAmount,
        toAddress: transfer.toAddress,
      });
      txTo = srcToken.address;
      txValue = '0x0';
    }

    const txObject = yield call(getTxObject, {
      from: account.address,
      to: txTo,
      value: txValue,
      data: txData
    });

    const txHash = yield call(account.walletService.sendTransaction, txObject, account.walletPassword);
    yield put(txActions.setTxHash(txHash));
    yield call(fetchTransactionReceipt, txHash);
  } catch (error) {
    console.log(error.message);
  }
}

export default function* transferWatcher() {
  yield takeLatest(transferActions.transferActionTypes.TRANSFER, transfer);
}
