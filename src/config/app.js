import { TOMO, USD } from './tokens'

const AppConfig = {
  EXCHANGE_SWAP_MODE: 'swap',
  EXCHANGE_TRANSFER_MODE: 'transfer',
  MARKET_BASED_TOKENS: [TOMO, USD],
  MIN_CONVERSION_RATE: '0.000001',
  MARKET_RATE_FETCHING_INTERVAL: 10000,
};

export default AppConfig;
