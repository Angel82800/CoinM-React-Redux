import { Map } from 'immutable';

import * as actionTypes from "../../constants/ActionTypes";

const initialState = new Map({
  candleHistory: {},
  spotPrices: [],
  balanceOverTime: [],

  candleHistoryLoading: false,

  candleHistoryError: null,
  sendOrderCallback: null
});

const preZero = (value) => {
  if (value < 10) return "0" + value;
  return value + "";
};

function exchangeReducer(state = initialState, action) {
  if (!action)
    return state;

  switch (action.type) {
    case "SEND_ORDER_WS": {
      return Object.assign({}, state, {
        sendOrderCallback: action.callback,
        sendOrderFailureTimeout: action.timeout
      });
    }

    case "SEND_ORDER_WS_SUCCESS": {
      clearTimeout(state.sendOrderFailureTimeout);
      state.sendOrderCallback(action.data);
      return Object.assign({}, state, {
        sendOrderCallback: null,
        sendOrderFailureTimeout: null
      });
    }

    case "SEND_ORDER_WS_FAIL": {
      return Object.assign({}, state, {
        sendOrderCallback: null
      });
    }

    case actionTypes.GET_CANDLE_HISTORY: {
      return Object.assign({}, state, {
        candleHistoryLoading: true
      });
    }

    case actionTypes.GET_CANDLE_HISTORY_SUCCESS: {
      const newCandles = action.data.map(dt => {
        return {
          DT: dt.timestamp,
          Open: dt.o,
          High: dt.h,
          Low: dt.l,
          Close: dt.c,
          Volume: dt.v
        }
      });

      let candleHistory = ((state.candleHistory || {})[action.pair] || {})[action.timeframe] || [];
      if (newCandles.length) {
        if (action.data.force)
          candleHistory = newCandles;
        else {
          let i = candleHistory.findIndex(candle => candle.DT == newCandles[0].DT);
          if (i >= 0)
            candleHistory.splice(i, candleHistory.length - i, ...newCandles);
          else
            candleHistory.push(...newCandles);
        }
      }

      const allCandleHistory = state.candleHistory || {};
      allCandleHistory[action.pair] = allCandleHistory[action.pair] || {};
      allCandleHistory[action.pair][action.timeframe] = candleHistory;

      console.log(allCandleHistory);

      return Object.assign({}, state, {
        candleHistory: allCandleHistory,
        candleHistoryLoading: false,
        candleHistoryError: null
      });
    }

    case actionTypes.GET_CANDLE_HISTORY_ERROR: {
      return Object.assign({}, state, {
        candleHistoryLoading: false,
        candleHistoryError: action.errorMsg
      });
    }

    case actionTypes.GET_PRICES_SUCCESS: {
      let spotPrices = state.spotPrices || {};
      action.data.latestPrices.forEach(price =>
        spotPrices[price.pair] = price.price
      );
      return Object.assign({}, state, {
        spotPrices
      });
    }

    case actionTypes.GET_BALANCE_OVERTIME_SUCCESS: {
      return Object.assign({}, state, {
        balanceOverTime: {
          ...state.balanceOverTime,
          [action.timeframe]: action.data
        }
      });
    }

    case "persist/REHYDRATE": {
      return Object.assign({}, state, {
        candleHistory: action.payload
          && action.payload.exchangeReducer
          && action.payload.exchangeReducer.candleHistory && [],
        spotPrices: action.payload
          && action.payload.exchangeReducer
          && action.payload.exchangeReducer.spotPrices && {},
        balanceOverTime: action.payload
          && action.payload.exchangeReducer
          && action.payload.exchangeReducer.balanceOverTime && [],
      });
      // Don't rehydrate trade stuff
    }

    default: {
      return state;
    }
  }
}

export default exchangeReducer;
