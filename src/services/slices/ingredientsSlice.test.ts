import { describe, it, expect } from 'vitest';

import { mockBun, mockMainIngredient } from '@/constants/mock-data';

import reducer, { initialState, fetchIngredients } from './ingredientsSlice';

import type { IngredientType } from '@/utils/types';

const mockIngredients: IngredientType[] = [mockBun, mockMainIngredient];

describe('ingredientsSlice', () => {
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
