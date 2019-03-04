import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as accountActions from "../actions/accountAction";
import { getTokenBalances } from "../services/networkService";
import { setTokens } from "../actions/tokenAction";
import { setGlobalError } from "../actions/globalAction";
import { formatBigNumber } from "../utils/helpers";
import { setAddress, setBalanceLoading } from "../actions/accountAction";
import envConfig from "../config/env";
import Web3 from "web3";

const getTokens = state => state.token.tokens;

function *importAccount(action) {
  const address = action.payload;

  yield put(setAddress(address));
  yield call(fetchBalance, address);
}

function *importByMetamask() {
  if (!window.ethereum) {
    yield put(setGlobalError(`Cannot connect to Metamask. Please make sure you have Metamask installed`));
    return;
  }

  yield call(window.ethereum.enable);

  const web3Instance = getWeb3Instance();
  const givenProvider = web3Instance.eth.givenProvider;

  const address = givenProvider.selectedAddress;
  const networkId = givenProvider.networkVersion;

  if (+networkId !== envConfig.NETWORK_ID) {
    yield put(setGlobalError(`Your Network ID should be ${envConfig.NETWORK_ID} that represents TomoChain Network`));
    return;
  }

  yield put(setAddress(address));
  yield call(fetchBalance, address);
}

function *fetchBalance(address) {
  yield put(setBalanceLoading(true));

  const tokens = yield select(getTokens);
  const balances = yield call(getTokenBalances, tokens, address);

  tokens.forEach((token, index) => {
    token.balance = balances[index] ? formatBigNumber(balances[index]) : 0;
  });

  yield put(setTokens(tokens));

  yield put(setBalanceLoading(false));
}

function getWeb3Instance() {
  return new Web3(new Web3.providers.HttpProvider(envConfig.RPC_ENDPOINT));
}

export default function* accountWatcher() {
  yield takeLatest(accountActions.accountActionTypes.CONNECT_TO_METAMASK, importByMetamask);
  yield takeLatest(accountActions.accountActionTypes.IMPORT_ACCOUNT, importAccount);
}
