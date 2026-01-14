import { configureStore } from '@reduxjs/toolkit';

import { setStore, setupAuthInterceptor } from '@api/authInterceptor';

import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Настраиваем interceptor для работы с токенами из Redux store
setStore(store);
setupAuthInterceptor();

export default store;
