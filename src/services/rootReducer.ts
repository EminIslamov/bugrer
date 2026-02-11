import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import currentIngredientReducer from './slices/currentIngredientSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  feed: feedReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer,
  auth: authReducer,
});

export default rootReducer;
