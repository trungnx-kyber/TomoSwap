import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRate } from "../services/web3Service";
import * as swapActions from "../actions/swapAction";
import { formatBigNumber } from "../utils/helpers";

const getSwapState = state => state.swap;

function *fetchTokenPairRate() {
  const swap = yield select(getSwapState);
  const srcToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;
  const isValidInput = yield call(validateValidInput, swap);

  if (!isValidInput) return;

  yield put(swapActions.setTokenPairRateLoading(true));

  try {
    let { expectedRate } = yield call(getRate, srcToken.address, destToken.address, sourceAmount);

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
}

function *validateValidInput(swap) {
  const sourceToken = swap.sourceToken;
  const sourceAmount = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.precision;
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

  if (sourceAmount > sourceToken.balance) {
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
  yield takeLatest([swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE], fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, fetchTokenPairRate);
}
