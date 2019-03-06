export const txActionTypes = {
  SET_TX_HASH: 'TX.SET_TX_HASH',
  SET_IS_TX_MINED: 'TX.SET_IS_TX_MINED',
};

export function setTxHash(hash = null) {
  return {
    type: txActionTypes.SET_TX_HASH,
    payload: hash
  }
}

export function setIsTxMined(isTxMined) {
  return {
    type: txActionTypes.SET_IS_TX_MINED,
    payload: isTxMined
  }
}
