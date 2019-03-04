export const accountActionTypes = {
  FETCH_BALANCE: 'ACCOUNT.FETCH_BALANCE',
  IMPORT_ACCOUNT: 'ACCOUNT.IMPORT_ACCOUNT',
  SET_BALANCE_LOADING: 'ACCOUNT.SET_BALANCE_LOADING',
  CONNECT_TO_METAMASK: 'ACCOUNT.CONNECT_TO_METAMASK',
  SET_ADDRESS: 'ACCOUNT.SET_ADDRESS',
  SET_ACCOUNT_LOADING: 'ACCOUNT.SET_ACCOUNT_LOADING',
};

export function importAccount(address) {
  return {
    type: accountActionTypes.IMPORT_ACCOUNT,
    payload: address
  }
}

export function connectToMetamask() {
  return {
    type: accountActionTypes.CONNECT_TO_METAMASK,
  }
}

export function setAddress(address = null) {
  return {
    type: accountActionTypes.SET_ADDRESS,
    payload: address
  }
}

export function setAccountLoading(isLoading) {
  return {
    type: accountActionTypes.SET_ACCOUNT_LOADING,
    payload: isLoading
  }
}

export function setBalanceLoading(isLoading) {
  return {
    type: accountActionTypes.SET_BALANCE_LOADING,
    payload: isLoading
  }
}
