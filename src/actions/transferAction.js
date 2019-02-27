export const transferActionTypes = {
  SET_SOURCE_TOKEN: 'TRANSFER.SET_SOURCE_TOKEN',
  SET_SOURCE_AMOUNT: 'TRANSFER.SET_SOURCE_AMOUNT',
  SET_TO_ADDRESS: 'TRANSFER.SET_TO_ADDRESS',
  SET_ERROR: 'TRANSFER.SET_ERROR',
};

export function setSourceToken(token) {
  return {
    type: transferActionTypes.SET_SOURCE_TOKEN,
    payload: token
  }
}

export function setSourceAmount(amount) {
  return {
    type: transferActionTypes.SET_SOURCE_AMOUNT,
    payload: amount
  }
}

export function setToAddress(address) {
  return {
    type: transferActionTypes.SET_TO_ADDRESS,
    payload: address
  }
}

export function setError(message) {
  return {
    type: transferActionTypes.SET_ERROR,
    payload: message
  }
}
