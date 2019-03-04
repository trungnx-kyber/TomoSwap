import { accountActionTypes } from '../actions/accountAction';

const initialState = {
  address: null,
  isBalanceLoading: false,
  isAccountLoading: false,
};

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case accountActionTypes.SET_BALANCE_LOADING: {
      return {
        ...state,
        isBalanceLoading: action.payload
      }
    }
    case accountActionTypes.SET_ADDRESS: {
      return {
        ...state,
        address: action.payload
      }
    }
    case accountActionTypes.SET_ACCOUNT_LOADING: {
      return {
        ...state,
        isAccountLoading: action.payload
      }
    }
    default:
      return state;
  }
}
