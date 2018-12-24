import ExchangeActions from "../exchange/actions";
import TradeActions from "../trade/actions";

const socketMiddleware = store => next => action => {
  const onOpen = (socketId, socket, store) => () => {
    store.dispatch({
      type: "SOCKET_CONNECT",
      socketId,
      data: {
        socket
      }
    });
  };
  const onClose = (socketId, store) => () => {
    store.dispatch({
      type: "SOCKET_DISCONNECT",
      socketId
    });
  };
  const onMessage = (store) => payload => {
    store.dispatch(ExchangeActions.exchangeWS(JSON.parse(payload.data)));
    store.dispatch(TradeActions.tradeWS(JSON.parse(payload.data)));
  };

  if (action.type == "SOCKET_SEND" && action.socketId) {
    let socket = store.getState().socketReducer.sockets[action.socketId];
    if (((socket || {}).readyState || 2) > 1) {
      socket = new WebSocket(action.url);
      socket.onmessage = onMessage(store);
      socket.onclose = onClose(action.socketId, store);
      socket.onopen = onOpen(action.socketId, socket, store);
    }
    if (socket.readyState == 1)
      socket.send(JSON.stringify(action.data));
    else
      store.dispatch({
        ...action,
        type: "SOCKET_ENQUEUE"
      });
  }

  return next(action);
}

export default socketMiddleware;