import { transferActionTypes } from '../actions/transferAction';
import { TOMO } from '../config/tokens';

const initialState = {
  sourceToken: TOMO,
  sourceAmount: '',
  toAddress: '',
  error: null
};

export default function transferReducer(state = initialState, action) {
  switch (action.type) {
    case transferActionTypes.SET_SOURCE_TOKEN: {
      console.log(action.payload);
      return {
        ...state,
        sourceToken: action.payload
      }
    }
    case transferActionTypes.SET_SOURCE_AMOUNT: {
      return {
        ...state,
        sourceAmount: action.payload,
        error: ''
      }
    }
    case transferActionTypes.SET_TO_ADDRESS: {
      return {
        ...state,
        toAddress: action.payload
      }
    }
    case transferActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    default:
      return state;
  }
}
