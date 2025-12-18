import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ingredient: null,
};

const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    // Установить текущий ингредиент
    setCurrentIngredient: (state, action) => {
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
