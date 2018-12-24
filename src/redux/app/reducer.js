import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";

import userReducer from "../account/reducer";
import purchaseReducer from "../purchase/reducer";
import twoFactorReducer from "../twoFactor/reducer";
import kycReducer from "../kyc/reducer";
import exchangeReducer from "../exchange/reducer";
import tradeReducer from "../trade/reducer";
import socketReducer from "../websockets/reducer";

const reducers = {
    routing,
    userReducer,
    purchaseReducer,
    twoFactorReducer,
    kycReducer,
    exchangeReducer,
    tradeReducer,
    socketReducer
};

const appReducer = combineReducers(reducers);
export default appReducer;
