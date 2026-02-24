import { describe, it, expect } from 'vitest';

import reducer, { clearOrder, createOrder } from './orderSlice';

const mockOrderResponse = {
  order: { number: 12345 },
  name: 'Test burger',
  success: true,
};

describe('orderSlice', () => {
  const initialState = {
    order: null,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearOrder', () => {
    const stateWithOrder = {
      order: mockOrderResponse,
      isLoading: false,
      error: 'some error',
    };
    const state = reducer(stateWithOrder, clearOrder());
    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should handle createOrder.pending', () => {
    const state = reducer(initialState, createOrder.pending('', []));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should clear error on createOrder.pending', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const state = reducer(stateWithError, createOrder.pending('', []));
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  it('should handle createOrder.fulfilled', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = reducer(
      pendingState,
      createOrder.fulfilled(mockOrderResponse, '', [])
    );
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrderResponse);
  });

  it('should handle createOrder.rejected', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = reducer(
      pendingState,
      createOrder.rejected(new Error('Order failed'), '', [])
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Order failed');
  });

  it('should use error.message from action.error when rejected', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = reducer(pendingState, createOrder.rejected(null, '', [], undefined));
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeDefined();
  });
});
