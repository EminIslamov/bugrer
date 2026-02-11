import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ConstructorIngredientType, IngredientType } from '@/utils/types';

type BurgerConstructorState = {
  bun: IngredientType | null;
  ingredients: ConstructorIngredientType[];
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<IngredientType>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<ConstructorIngredientType>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
