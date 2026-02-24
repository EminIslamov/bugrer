import { describe, it, expect } from 'vitest';

import reducer, {
  setCurrentIngredient,
  clearCurrentIngredient,
} from './currentIngredientSlice';

import type { IngredientType } from '@/utils/types';

const mockIngredient: IngredientType = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
};

describe('currentIngredientSlice', () => {
  const initialState = {
    ingredient: null,
  };

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
