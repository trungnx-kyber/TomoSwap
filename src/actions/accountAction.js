export const accountActionTypes = {
  FETCH_BALANCE: 'ACCOUNT.FETCH_BALANCE',
  IMPORT_ACCOUNT: 'ACCOUNT.IMPORT_ACCOUNT',
  SET_BALANCE_LOADING: 'ACCOUNT.SET_BALANCE_LOADING',
  SET_WALLET: 'ACCOUNT.SET_WALLET',
  SET_WALLET_PASSWORD: 'ACCOUNT.SET_WALLET_PASSWORD',
};

export function importAccount(address, walletType) {
  return {
    type: accountActionTypes.IMPORT_ACCOUNT,
    payload: { address, walletType }
  }
}

export function setWallet(address = null, walletType = null) {
  return {
    type: accountActionTypes.SET_WALLET,
    payload: { address, walletType }
  }
}

export function setWalletPassword(password) {
  return {
    type: accountActionTypes.SET_WALLET_PASSWORD,
    payload: password
  }
}

export function setBalanceLoading(isLoading) {
  return {
    type: accountActionTypes.SET_BALANCE_LOADING,
    payload: isLoading
  }
}
