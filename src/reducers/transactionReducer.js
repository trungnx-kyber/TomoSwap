import { txActionTypes } from '../actions/transactionAction';

const initialState = {
  txHash: null,
  isTxMined: false,
};

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case txActionTypes.SET_TX_HASH: {
      return {
        ...state,
        txHash: action.payload
      }
    }
    case txActionTypes.SET_IS_TX_MINED: {
      return {
        ...state,
        isTxMined: action.payload
      }
    }
    default:
      return state;
  }
}
