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

let TradeActions = {
  tradeWS: function (payload) {
    return (dispatch) => {
      if (payload.orderStatus)
        return dispatch(this.getOpenOrdersSuccess(
          payload.orderStatus
        ));
      else if (payload.orderHistory)
        return dispatch(this.getOrderHistorySuccess(
          payload.orderHistory,
        ));
      else if (payload.tickData)
        return dispatch(this.getTradeHistorySuccess(
          payload.tickData
        ));
      else if (payload.tick)
        return dispatch(this.getTradeHistorySuccess(
          [payload.tickData]
        ));
      else if (payload.book)
        return dispatch(this.getBookSuccess(
          payload.book
        ));
      else if (payload.bookUpdates)
        return dispatch(this.getBookUpdatesSuccess(
          payload.bookUpdates,
        ));
      else if (payload.bookUpdate)
        return dispatch(this.getBookUpdatesSuccess(
          [payload.bookUpdates],
        ));
    }
  },

  getOpenOrdersWS: function (token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/command?token=" + token;

      dispatch({
        type: "SOCKET_SEND",
        socketId: "trade",
        url,
        data: { openOrdersRequest }
      });
    }
  },

  getOpenOrders: function (token) {
    return (dispatch) => {
      dispatch(this.getOpenOrdersStart());

      setBearerToken(token);

      return instance.get('orders/active')
        .then((response) => {
          dispatch(this.getOpenOrdersSuccess(response.data));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(this.getOpenOrdersError(error.response.data));
          } else {
            dispatch(this.getOpenOrdersError(error.message));
          }
        })
    }
  },

  getOpenOrdersStart: function () {
    return {
      type: actionTypes.GET_OPEN_ORDERS
    }
  },

  getOpenOrdersSuccess: function (data) {
    return {
      type: actionTypes.GET_OPEN_ORDERS_SUCCESS,
      data
    }
  },

  getOpenOrdersError: function (errorMsg) {
    return {
      type: actionTypes.GET_OPEN_ORDERS_ERROR,
      errorMsg
    }
  },

  getOrderHistoryWS: function (token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/command?token=" + token;

      dispatch({
        type: "SOCKET_SEND",
        socketId: "trade",
        url,
        data: { orderHistoryRequest }
      });
    }
  },

  getOrderHistory: function (token) {
    return (dispatch) => {
      dispatch(this.getOrderHistoryStart());

      setBearerToken(token);

      return instance.get('orders/history')
        .then((response) => {
          dispatch(this.geOrderHistorySuccess(response.data));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(this.getOrderHistoryError(error.response.data));
          } else {
            dispatch(this.getOrderHistoryError(error.message));
          }
        })
    }
  },

  getOrderHistoryStart: function () {
    return {
      type: actionTypes.GET_ORDER_HISTORY
    }
  },

  geOrderHistorySuccess: function (data) {
    return {
      type: actionTypes.GET_ORDER_HISTORY_SUCCESS,
      data
    }
  },

  getOrderHistoryError: function (errorMsg) {
    return {
      type: actionTypes.GET_ORDER_HISTORY_ERROR,
      errorMsg
    }
  },


  getTradeHistoryWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/data";

      dispatch({
        type: "SOCKET_SEND",
        socketId: "dataExchange",
        url,
        data: { ticks: data }
      });
    }
  },

  getTradeHistory: function (data, token) {
    return (dispatch) => {
      dispatch(this.getTradeHistoryStart());

      setBearerToken(token);

      return instance.get('ticks/' + data.pair + "/" + (data.from ? data.from : ''))
        .then((response) => {
          dispatch(this.getTradeHistorySuccess(response.data));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(this.getTradeHistoryError(error.response.data));
          } else {
            dispatch(this.getTradeHistoryError(error.message));
          }
        })
    }
  },

  getTradeHistoryStart: function () {
    return {
      type: actionTypes.GET_TRADE_HISTORY
    }
  },

  getTradeHistorySuccess: function (data) {
    return {
      type: actionTypes.GET_TRADE_HISTORY_SUCCESS,
      data
    }
  },

  getTradeHistoryError: function (errorMsg) {
    return {
      type: actionTypes.GET_TRADE_HISTORY_ERROR,
      errorMsg
    }
  },

  getBookWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/data";

      dispatch({
        type: "SOCKET_SEND",
        socketId: "dataExchange",
        url,
        data: { book: data }
      });
    }
  },

  getBook: function (data, token) {
    return (dispatch) => {
      dispatch(this.getBookStart());

      setBearerToken(token);

      return instance.get('book/' + data.pair)
        .then((response) => {
          dispatch(this.getBookSuccess(response.data));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(this.getBookError(error.response.data));
          } else {
            dispatch(this.getBookError(error.message));
          }
        })
    }
  },

  getBookStart: function () {
    return {
      type: actionTypes.GET_BOOK_DATA
    }
  },

  getBookSuccess: function (data) {
    return {
      type: actionTypes.GET_BOOK_DATA_SUCCESS,
      data
    }
  },

  getBookError: function (errorMsg) {
    return {
      type: actionTypes.GET_BOOK_DATA_ERROR,
      errorMsg,
    }
  },


  getBookUpdatesWS: function (data, token) {
    return (dispatch) => {
      const url = process.env.EXCHANGE_API_URI + "ws-staging/data";

      dispatch({
        type: "SOCKET_SEND",
        socketId: "dataExchange",
        url,
        data: { bookUpdates: data }
      });
    }
  },

  getBookUpdates: function (data, token) {
    return (dispatch) => {
      dispatch(this.getBookStart());

      setBearerToken(token);

      return instance.get('bookUpdates/' + data.pair + '/' + (data.from ? data.from : ''))
        .then((response) => {
          dispatch(this.getBookUpdatesSuccess(response.data));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(this.getBookUpdatesError(error.response.data));
          } else {
            dispatch(this.getBookUpdatesError(error.message));
          }
        })
    }
  },

  getBookUpdatesStart: function () {
    return {
      type: actionTypes.GET_BOOK_UPDATES
    }
  },

  getBookUpdatesSuccess: function (data) {
    return {
      type: actionTypes.GET_BOOK_UPDATES_SUCCESS,
      data
    }
  },

  getBookUpdatesError: function (errorMsg) {
    return {
      type: actionTypes.GET_BOOK_UPDATES_ERROR,
      errorMsg,
    }
  },


};

export default TradeActions;
