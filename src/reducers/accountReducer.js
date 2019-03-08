import { accountActionTypes } from '../actions/accountAction';

const initialState = {
  address: null,
  walletType: null,
  walletPassword: '',
  isBalanceLoading: false,
};

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case accountActionTypes.SET_BALANCE_LOADING: {
      return {
        ...state,
        isBalanceLoading: action.payload
      }
    }
    case accountActionTypes.SET_WALLET: {
      const { address, walletType } = action.payload;
      return {...state, address, walletType}
    }
    case accountActionTypes.SET_WALLET_PASSWORD: {
      return {...state, walletPassword: action.payload}
    }
    default:
      return state;
  }
}
