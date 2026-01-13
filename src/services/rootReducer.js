import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import currentIngredientReducer from './slices/currentIngredientSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
  auth: authReducer,
});

export default rootReducer;
