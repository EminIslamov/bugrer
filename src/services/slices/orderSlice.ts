import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { apiService } from '@api/api';

type OrderResponse = {
  order: {
    number: number;
  };
  name?: string;
  success?: boolean;
};

type OrderState = {
  order: OrderResponse | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk<OrderResponse, string[]>(
  'order/createOrder',
  async (ingredientIds) => {
    const response = await apiService.post('/orders', {
      ingredients: ingredientIds,
    });
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при оформлении заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
