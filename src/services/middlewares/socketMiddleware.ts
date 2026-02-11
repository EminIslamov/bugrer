import type { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

import type { AppDispatch, RootState } from '../types';

type TWSStoreActions = {
  wsInit: string;
  wsClose: string;
  wsSendMessage: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

type IMessageResponse = {
  success?: boolean;
  orders?: unknown[];
  total?: number;
  totalToday?: number;
};

const getAccessToken = (state: RootState): string | null => {
  const token = state.auth?.accessToken;
  if (!token) return null;
  if (token.startsWith('Bearer ')) {
    return token.replace('Bearer ', '');
  }
  return token;
};

export const socketMiddleware = (
  wsUrl: string,
  wsActions: TWSStoreActions,
  withToken = false
): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next: Dispatch) => (action: AnyAction) => {
      const { dispatch, getState } = store;
      const { type, payload } = action;
      const { wsInit, wsClose, wsSendMessage, onOpen, onClose, onError, onMessage } =
        wsActions;

      if (type === wsInit) {
        if (socket) {
          socket.close();
        }

        let url = wsUrl;
        if (withToken) {
          const accessToken = getAccessToken(getState());
          if (!accessToken) {
            console.debug('[WS init] skipped: missing access token');
            next(action);
            return;
          }
          url = `${wsUrl}?token=${accessToken}`;
        }

        console.debug('[WS init] connecting', url);
        socket = new WebSocket(url);

        socket.onopen = (): void => {
          console.debug('[WS open]');
          dispatch({ type: onOpen });
        };

        socket.onerror = (): void => {
          console.debug('[WS error]');
          dispatch({ type: onError, payload: 'WebSocket error' });
        };

        socket.onmessage = (event): void => {
          const { data } = event;
          const parsedData = JSON.parse(data) as IMessageResponse;
          const { success, ...restParsedData } = parsedData;

          if (success === false) {
            dispatch({ type: onError, payload: 'WebSocket error' });
            return;
          }

          console.debug('[WS message]', restParsedData);
          dispatch({
            type: onMessage,
            payload: restParsedData,
          });
        };

        socket.onclose = (event): void => {
          console.debug('[WS close]', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });
          dispatch({
            type: onClose,
            payload: {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean,
            },
          });
        };
      }

      if (type === wsClose && socket) {
        socket.close();
        socket = null;
      }

      if (type === wsSendMessage && socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      }

      next(action);
    };
  }) as Middleware;
};
