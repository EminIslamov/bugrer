import { describe, it, expect } from 'vitest';

import reducer, { fetchIngredients } from './ingredientsSlice';

import type { IngredientType } from '@/utils/types';

const mockIngredients: IngredientType[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  },
];

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const state = reducer(initialState, fetchIngredients.pending(''));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should clear error on fetchIngredients.pending', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const state = reducer(stateWithError, fetchIngredients.pending(''));
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = reducer(pendingState, fetchIngredients.fulfilled(mockIngredients, ''));
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('should handle fetchIngredients.rejected', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = reducer(
      pendingState,
      fetchIngredients.rejected(new Error('Network error'), '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should use error.message from action.error when rejected', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = reducer(
      pendingState,
      fetchIngredients.rejected(null, '', undefined, undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeDefined();
  });
});
