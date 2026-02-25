import { describe, it, expect } from 'vitest';

import { mockMainIngredient as mockIngredient } from '@/constants/mock-data';

import reducer, {
  initialState,
  setCurrentIngredient,
  clearCurrentIngredient,
} from './currentIngredientSlice';

import type { IngredientType } from '@/utils/types';

describe('currentIngredientSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCurrentIngredient', () => {
    const state = reducer(initialState, setCurrentIngredient(mockIngredient));
    expect(state.ingredient).toEqual(mockIngredient);
  });

  it('should handle clearCurrentIngredient', () => {
    const stateWithIngredient = { ingredient: mockIngredient };
    const state = reducer(stateWithIngredient, clearCurrentIngredient());
    expect(state.ingredient).toBeNull();
  });

  it('should replace current ingredient when setting a new one', () => {
    const anotherIngredient: IngredientType = {
      ...mockIngredient,
      _id: 'another-id',
      name: 'Another ingredient',
    };
    let state = reducer(initialState, setCurrentIngredient(mockIngredient));
    state = reducer(state, setCurrentIngredient(anotherIngredient));
    expect(state.ingredient).toEqual(anotherIngredient);
  });
});
