import { createAction, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Order } from '@/utils/types';

type OrdersState = {
  isConnected: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
  error: string | null;
};

type OrdersMessage = {
  orders?: Order[];
  total?: number;
  totalToday?: number;
};

const initialState: OrdersState = {
  isConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
};

export const feedWsInit = createAction('feed/wsInit');
export const feedWsClose = createAction('feed/wsClose');
export const feedWsSendMessage = createAction<unknown>('feed/wsSendMessage');

export const feedWsOpen = createAction('feed/wsOpen');
export const feedWsClosed = createAction('feed/wsClosed');
export const feedWsError = createAction<string>('feed/wsError');
export const feedWsMessage = createAction<OrdersMessage>('feed/wsMessage');

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedWsOpen, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addCase(feedWsClosed, (state) => {
        state.isConnected = false;
      })
      .addCase(feedWsError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addCase(feedWsMessage, (state, action: PayloadAction<OrdersMessage>) => {
        state.orders = action.payload.orders ?? [];
        state.total = action.payload.total ?? 0;
        state.totalToday = action.payload.totalToday ?? 0;
      });
  },
});

export default feedSlice.reducer;
