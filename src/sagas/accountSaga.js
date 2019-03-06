import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as accountActions from "../actions/accountAction";
import { getTokenBalances } from "../services/networkService";
import { setTokens } from "../actions/tokenAction";
import { formatBigNumber } from "../utils/helpers";
import { setWallet, setBalanceLoading } from "../actions/accountAction";

const getTokens = state => state.token.tokens;

function *importAccount(action) {
  const { address, walletType } = action.payload;

  yield put(setWallet(address, walletType));
  yield call(fetchBalance, address);
}

function *fetchBalance(address) {
  yield put(setBalanceLoading(true));

  const tokens = yield select(getTokens);
  const balances = yield call(getTokenBalances, tokens, address);

  tokens.forEach((token, index) => {
    token.balance = balances[index] ? formatBigNumber(balances[index], token.decimals) : 0;
  });

  yield put(setTokens(tokens));
  yield put(setBalanceLoading(false));
}

export default function* accountWatcher() {
  yield takeLatest(accountActions.accountActionTypes.IMPORT_ACCOUNT, importAccount);
}
