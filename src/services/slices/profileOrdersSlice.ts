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

export const profileOrdersWsInit = createAction('profileOrders/wsInit');
export const profileOrdersWsClose = createAction('profileOrders/wsClose');
export const profileOrdersWsSendMessage = createAction<unknown>(
  'profileOrders/wsSendMessage'
);

export const profileOrdersWsOpen = createAction('profileOrders/wsOpen');
export const profileOrdersWsClosed = createAction('profileOrders/wsClosed');
export const profileOrdersWsError = createAction<string>('profileOrders/wsError');
export const profileOrdersWsMessage = createAction<OrdersMessage>(
  'profileOrders/wsMessage'
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileOrdersWsOpen, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addCase(profileOrdersWsClosed, (state) => {
        state.isConnected = false;
      })
      .addCase(profileOrdersWsError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addCase(profileOrdersWsMessage, (state, action: PayloadAction<OrdersMessage>) => {
        state.orders = action.payload.orders ?? [];
        state.total = action.payload.total ?? 0;
        state.totalToday = action.payload.totalToday ?? 0;
      });
  },
});

export default profileOrdersSlice.reducer;
