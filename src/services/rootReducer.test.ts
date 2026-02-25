import { describe, it, expect } from 'vitest';

import rootReducer from './rootReducer';

describe('rootReducer', () => {
  it('should return the initial state with all reducer keys', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('currentIngredient');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('profileOrders');
    expect(state).toHaveProperty('auth');
  });

  it('should have correct initial state for ingredients', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('should have correct initial state for burgerConstructor', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('should have correct initial state for currentIngredient', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.currentIngredient).toEqual({
      ingredient: null,
    });
  });

  it('should have correct initial state for feed', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.feed).toEqual({
      isConnected: false,
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
    });
  });

  it('should have correct initial state for order', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.order).toEqual({
      order: null,
      isLoading: false,
      error: null,
    });
  });

  it('should have correct initial state for profileOrders', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.profileOrders).toEqual({
      isConnected: false,
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
    });
  });

  it('should have correct initial state for auth', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.auth).toHaveProperty('user');
    expect(state.auth).toHaveProperty('accessToken');
    expect(state.auth).toHaveProperty('isLoading');
    expect(state.auth).toHaveProperty('error');
    expect(state.auth).toHaveProperty('passwordResetSuccess');
    expect(state.auth.isLoading).toBe(false);
    expect(state.auth.error).toBeNull();
  });
});
