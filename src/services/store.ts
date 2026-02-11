import { configureStore } from '@reduxjs/toolkit';

import { WS_BASE_URL } from '@api/api';
import { setStore, setupAuthInterceptor } from '@api/authInterceptor';

import { socketMiddleware } from './middlewares/socketMiddleware';
import rootReducer from './rootReducer';
import {
  feedWsClose,
  feedWsClosed,
  feedWsError,
  feedWsInit,
  feedWsMessage,
  feedWsOpen,
  feedWsSendMessage,
} from './slices/feedSlice';
import {
  profileOrdersWsClose,
  profileOrdersWsClosed,
  profileOrdersWsError,
  profileOrdersWsInit,
  profileOrdersWsMessage,
  profileOrdersWsOpen,
  profileOrdersWsSendMessage,
} from './slices/profileOrdersSlice';

const feedWsActions = {
  wsInit: feedWsInit.type,
  wsClose: feedWsClose.type,
  wsSendMessage: feedWsSendMessage.type,
  onOpen: feedWsOpen.type,
  onClose: feedWsClosed.type,
  onError: feedWsError.type,
  onMessage: feedWsMessage.type,
};

const profileOrdersWsActions = {
  wsInit: profileOrdersWsInit.type,
  wsClose: profileOrdersWsClose.type,
  wsSendMessage: profileOrdersWsSendMessage.type,
  onOpen: profileOrdersWsOpen.type,
  onClose: profileOrdersWsClosed.type,
  onError: profileOrdersWsError.type,
  onMessage: profileOrdersWsMessage.type,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware(`${WS_BASE_URL}/orders/all`, feedWsActions),
      socketMiddleware(`${WS_BASE_URL}/orders`, profileOrdersWsActions, true)
    ),
});

// Настраиваем interceptor для работы с токенами из Redux store
setStore(store);
setupAuthInterceptor();

export default store;
