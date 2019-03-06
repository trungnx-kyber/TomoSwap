import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as accountActions from "../actions/accountAction";
import { getTokenBalances } from "../services/networkService";
import { setTokens } from "../actions/tokenAction";
import { formatBigNumber } from "../utils/helpers";
import AppConfig from "../config/app";
import { setWallet, setBalanceLoading } from "../actions/accountAction";

const getTokens = state => state.token.tokens;

function *importAccount(action) {
  const { address, walletType } = action.payload;

  yield put(setWallet(address, walletType));
  yield call(fetchBalancesChannel, address);
}

function *fetchBalancesChannel(address) {
  yield call(fetchBalance, address, true);
  while (true) {
    yield call(fetchBalance, address);
  }
}

function *fetchBalance(address, isFirstLoading = false) {
  yield put(setBalanceLoading(isFirstLoading));

  const tokens = yield select(getTokens);
  const balances = yield call(getTokenBalances, tokens, address);

  tokens.forEach((token, index) => {
    token.balance = balances[index] ? formatBigNumber(balances[index], token.decimals) : 0;
  });

  yield put(setTokens(tokens));
  yield put(setBalanceLoading(false));
  yield call(delay, AppConfig.BALANCE_FETCHING_INTERVAL);
}

export default function* accountWatcher() {
  yield takeLatest(accountActions.accountActionTypes.IMPORT_ACCOUNT, importAccount);
}
