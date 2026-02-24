import { describe, it, expect } from 'vitest';

import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './burgerConstructorSlice';

import type { IngredientType, ConstructorIngredientType } from '@/utils/types';

const mockBun: IngredientType = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
};

const mockIngredient1: ConstructorIngredientType = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  uniqueId: 'test-uuid-1',
};

const mockIngredient2: ConstructorIngredientType = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  uniqueId: 'test-uuid-2',
};

const mockIngredient3: ConstructorIngredientType = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  uniqueId: 'test-uuid-3',
};

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setBun', () => {
    const state = reducer(initialState, setBun(mockBun));
    expect(state.bun).toEqual(mockBun);
  });

  it('should replace bun when setBun is called again', () => {
    const anotherBun: IngredientType = {
      ...mockBun,
      _id: 'another-bun',
      name: 'Another bun',
    };
    let state = reducer(initialState, setBun(mockBun));
    state = reducer(state, setBun(anotherBun));
    expect(state.bun).toEqual(anotherBun);
  });

  it('should handle addIngredient', () => {
    const state = reducer(initialState, addIngredient(mockIngredient1));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredient1);
  });

  it('should add multiple ingredients', () => {
    let state = reducer(initialState, addIngredient(mockIngredient1));
    state = reducer(state, addIngredient(mockIngredient2));
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(mockIngredient1);
    expect(state.ingredients[1]).toEqual(mockIngredient2);
  });

  it('should handle removeIngredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2],
    };
    const state = reducer(stateWithIngredients, removeIngredient('test-uuid-1'));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredient2);
  });

  it('should not remove anything if uniqueId does not match', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1],
    };
    const state = reducer(stateWithIngredients, removeIngredient('non-existent-id'));
    expect(state.ingredients).toHaveLength(1);
  });

  it('should handle moveIngredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2, mockIngredient3],
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );
    expect(state.ingredients[0]).toEqual(mockIngredient2);
    expect(state.ingredients[1]).toEqual(mockIngredient3);
    expect(state.ingredients[2]).toEqual(mockIngredient1);
  });

  it('should handle moveIngredient from end to start', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2, mockIngredient3],
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 2, toIndex: 0 })
    );
    expect(state.ingredients[0]).toEqual(mockIngredient3);
    expect(state.ingredients[1]).toEqual(mockIngredient1);
    expect(state.ingredients[2]).toEqual(mockIngredient2);
  });

  it('should handle clearConstructor', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2],
    };
    const state = reducer(stateWithData, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
