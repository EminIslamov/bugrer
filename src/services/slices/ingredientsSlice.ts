import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiService } from '@api/api';

import type { IngredientType } from '@/utils/types';

type IngredientsState = {
  items: IngredientType[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<IngredientType[]>(
  'ingredients/fetchIngredients',
  async () => {
    const response = await apiService.get('/ingredients');
    return response.data.data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      });
  },
});

export default ingredientsSlice.reducer;
