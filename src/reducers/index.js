import { combineReducers } from 'redux'
import accountReducer from "./accountReducer";
import tokenReducer from "./tokenReducer";
import marketReducer from "./marketReducer";
import swapReducer from "./swapReducer";
import globalReducer from "./globalReducer";

const reducer = combineReducers({
  global: globalReducer,
  account: accountReducer,
  token: tokenReducer,
  market: marketReducer,
  swap: swapReducer,
});

export default reducer
