import { Map } from 'immutable';

import * as actionTypes from "../../constants/ActionTypes";

const initialState = new Map({
  sockets: {},
  messageQueues: {}
});

function socketReducer(state = initialState, action) {
  if (!action)
    return state;

  const {socketId} = action;

  switch (action.type) {
    case "SOCKET_CONNECT":
      (state.messageQueues[socketId] || []).forEach(message => {
        action.data.socket.send(message);
      });
      return Object.assign({}, state, {
        sockets: {
          ...state.sockets,
          [socketId]: action.data.socket
        },
        messageQueues: {
          ...state.messageQueues,
          [socketId]: []
        }
      });
    case "SOCKET_DISCONNECT":
      return Object.assign({}, state, {
        sockets: {
          ...state.sockets,
          [socketId]: undefined
        }
      });
      case "SOCKET_ENQUEUE":
        return Object.assign({}, state, {
          messageQueues: {
            ...state.messageQueues,
            [socketId]: (state.messageQueues[socketId] || []).concat(JSON.stringify(action.data))
          }
        });
    default:
      return state;
  }
}

export default socketReducer;
