import { TOMO, USD } from './tokens'

const AppConfig = {
  EXCHANGE_SWAP_MODE: 'Swap',
  EXCHANGE_TRANSFER_MODE: 'Transfer',
  MARKET_BASED_TOKENS: [TOMO, USD],
  MIN_CONVERSION_RATE: '0.000001',
  MARKET_RATE_FETCHING_INTERVAL: 10000,
  BALANCE_FETCHING_INTERVAL: 10000,
  TOKEN_PAIR_RATE_INTERVAL: 10000,
  DEFAULT_WALLET_ID: '0x0000000000000000000000000000000000000000',
  DEFAULT_SLIPPAGE_RATE: 97,
  DEFAULT_GAS: 1000000,
  WALLET_TYPE_METAMASK: 'Metamask',
  WALLET_TYPE_KEYSTORE: 'Keystore',
};

export default AppConfig;
