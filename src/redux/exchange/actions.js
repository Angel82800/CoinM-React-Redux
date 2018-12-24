import axios from "axios";
import qs from "qs";

import * as actionTypes from "../../constants/ActionTypes";
import AccountActions from "../account/actions";

const instance = axios.create({
  baseURL: process.env.EXCHANGE_API_URI
});
instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const setBearerToken = (token) => {
  // add Bearer token to common instance request header
  instance.defaults.headers.common["Authorization"] = "Bearer " + token;
};

let ExchangeActions = {

  disableWallet: function (data, token) {
    return (dispatch) => {
      dispatch(this.disableWalletStart());

      setBearerToken(token);

      const body = {
        walletId: data.walletId
      };

      return axios.put("users/wallets", qs.stringify(body))
        .then((response) => {
          dispatch(this.disableWalletSuccess(response.data));
        })
        .catch((error) => {
          AccountActions.acceptErrorResponse(error, dispatch, token);

          if (error.response) {
            dispatch(this.disableWalletError(error.response.data));
          } else {
            dispatch(this.disableWalletError(error.message));
          }
        })
    }
  },

  disableWalletStart: function () {
    return {
      type: actionTypes.DISABLE_WALLET
    }
  },

  disableWalletSuccess: function () {
    return {
      type: actionTypes.DISABLE_WALLET_SUCCESS,
      data
    }
  },

  disableWalletError: function (errorMsg) {
    return {
      type: actionTypes.DISABLE_WALLET_ERROR,
      errorMsg
    }
  },

  exchangeWS: function (payload) {
    return (dispatch) => {
      if (payload.candleHistory)
        return dispatch(this.getCandleHistorySuccess(
          payload.candleHistory[0].pair,
          payload.candleHistory[0].timeframe,
          payload.candleHistory,
          true
        ));
      else if (payload.candle)
        return dispatch(this.getCandleHistorySuccess(
          payload.candle.pair,
          payload.candle.timeframe,
          [payload.candle],
          false
        ));
      else if (payload.balanceHistory)
        return dispatch(this.getBalanceOverTimeSuccess(
          payload.balanceHistory.data,
          payload.data.timeframe
        ));
      else if (payload.latestPrices)
        return dispatch(this.getPricesSuccess(
          {...payload}
        ));
      else if (payload.orderStatus)
        return dispatch({
          type: "SEND_ORDER_WS_SUCCESS",
          data: payload.orderStatus
        });
    }
  },

  getCandleHistoryWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/data";

      dispatch({
        type: "SOCKET_SEND",
        socketId: "dataExchange",
        url,
        data: { candleHistory: data }
      });
    }
  },

  getCandleHistory: function (data, token) {
    return (dispatch) => {
      dispatch(this.getCandleHistoryStart());

      setBearerToken(token);

      return instance.get('candles/' + data.pair + '/' + data.timeframe + '/' + (data.from || '0') + '/' + (data.to ? data.to : ''))
        .then((response) => {
          dispatch(this.getCandleHistorySuccess(data.pair, data.timeframe, response.data.candleHistory, data.force));
        })
        .catch((error) => {
          AccountActions.acceptErrorResponse(error, dispatch, token);

          if (error.response) {
            dispatch(this.getCandleHistoryError(error.response.data.response.errors.message));
          } else {
            dispatch(this.getCandleHistoryError(error.message));
          }
        });
    };
  },

  getCandleHistoryStart: function () {
    return {
      type: actionTypes.GET_CANDLE_HISTORY
    }
  },

  getCandleHistorySuccess: function (pair, timeframe, data, force) {
    return {
      type: actionTypes.GET_CANDLE_HISTORY_SUCCESS,
      pair,
      timeframe,
      data,
      force
    }
  },

  getCandleHistoryError: function (errorMsg) {
    return {
      type: actionTypes.GET_CANDLE_HISTORY_ERROR,
      errorMsg
    }
  },

  getBalanceOverTimeWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.REACT_APP_API_URI + "ws/data?token=" + token;

      dispatch({
        type: "SOCKET_SEND",
        socketId: "dataBackoffice",
        url,
        data: { balanceOverTimeRequest: data }
      });
    }
  },

  getBalanceOverTime: function (data, token) {
    return (dispatch) => {
      dispatch(this.getBalanceOverTimeStart());

      setBearerToken(token);

      return axios.get('users/wallets/balanceHistory/' + data.timeframe + (data.currency ? '/' + data.currency : ''))
        .then((response) => {
          dispatch(this.getBalanceOverTimeSuccess(response.data.data, data.timeframe));
        })
        .catch((error) => {
          AccountActions.acceptErrorResponse(error, dispatch, token);
          if (error.response) {
            dispatch(this.getBalanceOverTimeError(error.response.data.response.errors.message));
          } else {
            dispatch(this.getBalanceOverTimeError(error.message));
          }

          return Promise.reject();
        })
    }
  },

  getBalanceOverTimeStart: function () {
    return {
      type: actionTypes.GET_BALANCE_OVERTIME
    }
  },

  getBalanceOverTimeSuccess: function (data, timeframe) {
    return {
      type: actionTypes.GET_BALANCE_OVERTIME_SUCCESS,
      data,
      timeframe
    }
  },

  getBalanceOverTimeError: function (errorMsg) {
    return {
      type: actionTypes.GET_BALANCE_OVERTIME_ERROR,
      errorMsg
    }
  },

  sendOrderWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/command?token=" + token;

      return new Promise((resolve, reject) => {
        dispatch({
          type: "SOCKET_SEND",
          socketId: "trade",
          url,
          data: { newOrder: order }
        });
        dispatch({
          type: "SEND_ORDER_WS",
          callback: resolve,
          timeout: setTimeout(() => {
            dispatch({ type: "SEND_ORDER_WS_FAIL" });
            reject(new Error("Request timed out!"))
          }, 1000)
        });
      });
    }
  },

  sendOrder: function (token, order) {
    return (dispatch) => {
      dispatch(this.sendOrderStart());

      setBearerToken(token);

      return instance.post('orders/create', order)
        .then(response =>
          dispatch(this.sendOrderSuccess(response.data))
        )
        .catch((error) => {
          AccountActions.acceptErrorResponse(error, dispatch, token);
          if (error.response) {
            return dispatch(this.sendOrderError(error.response.data.response.errors.message));
          } else {
            return dispatch(this.sendOrderError(error.message));
          }

          return Promise.reject();
        })
    }
  },

  sendOrderStart: function () {
    return {
      type: actionTypes.SEND_ORDER
    }
  },

  sendOrderSuccess: function (data) {
    return {
      type: actionTypes.SEND_ORDER_SUCCESS,
      data
    }
  },

  sendOrderError: function (errorMsg) {
    return {
      type: actionTypes.SEND_ORDER_ERROR,
      errorMsg
    }
  },

  getPricesWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/data";

      dispatch({
        type: "SOCKET_SEND",
        socketId: "dataExchange",
        url,
        data: { priceRequest: data }
      });
    }
  },

  getPrices: function (token, pairs) {
    return (dispatch) => {
      dispatch(this.getPricesStart());

      setBearerToken(token);

      return instance.get("prices/" + pairs)
        .then((response) => {
          dispatch(this.getPricesSuccess(response.data));
        })
        .catch((error) => {
          AccountActions.acceptErrorResponse(error, dispatch, token);
          if (error.response) {
            dispatch(this.getPricesError(error.response.data.response.errors.message));
          } else {
            dispatch(this.getPricesError(error.message));
          }

          return Promise.reject();
        })
    }
  },

  getPricesStart: function () {
    return {
      type: actionTypes.GET_PRICES
    }
  },

  getPricesSuccess: function (data) {
    return {
      type: actionTypes.GET_PRICES_SUCCESS,
      data
    }
  },

  getPricesError: function (errorMsg) {
    return {
      type: actionTypes.GET_PRICES_ERROR,
      errorMsg
    }
  }
};

export default ExchangeActions;
