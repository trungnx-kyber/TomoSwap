import AppConfig from '../config/app';
import { globalActionTypes } from '../actions/globalAction';

const initialState = {
  isErrorActive: false,
  errorMessage: '',
  errorType: '',
  exchangeMode: AppConfig.EXCHANGE_SWAP_MODE,
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case globalActionTypes.SET_GLOBAL_ERROR: {
      const { isErrorActive, errorMessage, errorType } = action.payload;
      return { ...state, isErrorActive, errorMessage, errorType }
    }
    case globalActionTypes.SET_EXCHANGE_MODE: {
      return { ...state, exchangeMode: action.payload }
    }
    default:
      return state;
  }
}
