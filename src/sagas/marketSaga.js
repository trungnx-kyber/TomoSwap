import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getAllRates } from "../services/web3Service";
import { getUSDRateById } from "../services/coinGeckoService";
import * as marketActions from "../actions/marketAction";
import * as tokenActions from "../actions/tokenAction";
import AppConfig from "../config/app";
import { TOMO } from "../config/tokens";
import { formatBigNumber } from "../utils/helpers";

const getTokens = state => state.token.tokens;
const getMarketState = state => state.market;

function *fetchMarketRatesChannel() {
  yield call(fetchMarketRates);

  while (true) {
    yield call(fetchMarketRates, true);
  }
}

function *fetchMarketRates(isBackgroundLoading = false) {
  yield call(setLoading, true, isBackgroundLoading);

  try {
    let tokens = yield select(getTokens);
    const market = yield select(getMarketState);
    const indexToken = market.indexToken;
    let tokensWithRate = [];

    if (indexToken.symbol === 'USD') {
      tokensWithRate = yield call(getUSDBasedRates, tokens);
    } else {
      tokensWithRate = yield call(getTokenBasedRates, tokens);
    }

    yield put(tokenActions.setTokens(tokensWithRate));
  } catch (e) {
    console.log(e);
  }

  yield call(setLoading, false, isBackgroundLoading);

  yield call(delay, AppConfig.MARKET_RATE_FETCHING_INTERVAL);
}

function *getUSDBasedRates(tokens) {
  let tokensWithRate = yield call(getTokenBasedRates, tokens);
  const response = yield call(getUSDRateById, TOMO.id);
  const tomoUSDRate = response[0].current_price;

  return tokensWithRate.map((token) => {
    token.usdSellRate = tomoUSDRate * token.sellRate;
    token.usdBuyRate = tomoUSDRate * token.buyRate;
    return token;
  });
}

function *getTokenBasedRates(tokens) {
  let srcAddresses = [], destAddresses = [], srcAmounts = [];

  tokens.forEach((token) => {
    if (token.symbol !== TOMO.symbol) {
      srcAddresses.push(token.address);
      destAddresses.push(TOMO.address);
      srcAmounts.push(1);
    }
  });

  let sellRates = yield call(getAllRates, srcAddresses, destAddresses, srcAmounts);
  let buyRates = yield call(getAllRates, destAddresses, srcAddresses, srcAmounts);

  return tokens.map((token, index) => {
    if (token.symbol === TOMO.symbol) {
      token.sellRate = 1;
      token.buyRate = 1;
    } else {
      token.sellRate = formatBigNumber(sellRates[index - 1]);
      token.buyRate = formatBigNumber(buyRates[index - 1]);
    }

    return token;
  });
}

function *setLoading(isLoading, isBackgroundLoading = false) {
  if (isBackgroundLoading) {
    yield put(marketActions.setBackgroundLoading(isLoading));
  } else {
    yield put(marketActions.setLoading(isLoading));
  }
}

export default function* marketWatcher() {
  yield takeLatest(marketActions.marketActionTypes.FETCH_MARKET_RATES, fetchMarketRatesChannel);
  yield takeLatest(marketActions.marketActionTypes.SET_INDEX_TOKEN, fetchMarketRatesChannel);
}
