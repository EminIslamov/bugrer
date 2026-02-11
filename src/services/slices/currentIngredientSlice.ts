import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { IngredientType } from '@/utils/types';

type CurrentIngredientState = {
  ingredient: IngredientType | null;
};

const initialState: CurrentIngredientState = {
  ingredient: null,
};

const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<IngredientType>) => {
      state.ingredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;

export default currentIngredientSlice.reducer;
