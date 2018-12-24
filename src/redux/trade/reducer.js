import { Map } from 'immutable';

import * as actionTypes from "../../constants/ActionTypes";

const initialState = new Map({
  bookData: [],
  tradeHistory: [],
  openOrders: [],
  orderHistory: []
});

function tradeReducer(state = initialState, action) {
  if (!action)
    return state;

  switch (action.type) {
    case actionTypes.GET_BOOK_DATA_SUCCESS: {
      return Object.assign({}, state, {
        bookData: action.data.book
      });
    }

    case actionTypes.GET_BOOK_UPDATES_SUCCESS: {
      // Applies a single update to a book, utility function
      const applyBookUpdate = (book, bookUpdate) => {
        if (!!bookUpdate.qty)
          book[bookUpdate.side][bookUpdate.price] = bookUpdate.qty;
        else
          delete book[bookUpdate.side][bookUpdate.price];
        book.seqNumber = bookUpdate.seqNumber;
        return book;
      };
      return Object.assign({}, state, {
        bookData: action.data.bookUpdates.reduce(applyBookUpdate, state.bookData)
      });
    }

    case actionTypes.GET_TRADE_HISTORY_SUCCESS: {
      const tradeHistory = state.tradeHistory || [];
      const lastTimestamp = tradeHistory.length ? tradeHistory[tradeHistory.length - 1].timestamp : 0;
      tradeHistory.push(...(action.data.tickHistory || []).filter(tick => tick.timestamp > lastTimestamp));
      return Object.assign({}, state, {
        tradeHistory
      });
    }

    case actionTypes.GET_OPEN_ORDERS_SUCCESS: {
      return Object.assign({}, state, {
        openOrders: action.data
      });
    }

    case actionTypes.GET_ORDER_HISTORY_SUCCESS: {
      return Object.assign({}, state, {
        orderHistory: action.data
      });
    }

    case 'persist/REHYDRATE': {
      return Object.assign({}, state, {
        depthChartData: action.payload
          && action.payload.tradeReducer
          && action.payload.tradeReducer.depthChartData && {},
        tradeHistory: action.payload
          && action.payload.tradeReducer
          && action.payload.tradeReducer.tradeHistory && [],
        openOrders: action.payload
          && action.payload.tradeReducer
          && action.payload.tradeReducer.openOrders && [],
        orderHistory: action.payload
          && action.payload.tradeReducer
          && action.payload.tradeReducer.orderHistory && [],
      });
      // Don't rehydrate trade stuff
    }

    default: {
      return state;
    }
  }
}

export default tradeReducer;
