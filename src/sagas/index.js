import { fork, all } from 'redux-saga/effects';
import accountWatcher from './accountSaga';
import swapWatcher from './swapSaga';
import marketWatcher from './marketSaga';

export default function* rootSaga() {
  yield all([
    fork(accountWatcher),
    fork(swapWatcher),
    fork(marketWatcher),
  ]);
}
