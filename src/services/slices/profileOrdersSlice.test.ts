import { describe, it, expect } from 'vitest';

import reducer, {
  profileOrdersWsOpen,
  profileOrdersWsClosed,
  profileOrdersWsError,
  profileOrdersWsMessage,
} from './profileOrdersSlice';

import type { Order } from '@/utils/types';

const mockOrders: Order[] = [
  {
    _id: 'order1',
    ingredients: ['643d69a5c3f7b9001cfa093c'],
    status: 'done',
    name: 'My order',
    number: 55555,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('profileOrdersSlice', () => {
  const initialState = {
    isConnected: false,
    orders: [],
    total: 0,
    totalToday: 0,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle profileOrdersWsOpen', () => {
    const stateWithError = { ...initialState, error: 'connection error' };
    const state = reducer(stateWithError, profileOrdersWsOpen());
    expect(state.isConnected).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle profileOrdersWsClosed', () => {
    const connectedState = { ...initialState, isConnected: true };
    const state = reducer(connectedState, profileOrdersWsClosed());
    expect(state.isConnected).toBe(false);
  });

  it('should handle profileOrdersWsError', () => {
    const state = reducer(initialState, profileOrdersWsError('WebSocket error'));
    expect(state.error).toBe('WebSocket error');
  });

  it('should handle profileOrdersWsMessage', () => {
    const message = {
      orders: mockOrders,
      total: 50,
      totalToday: 5,
    };
    const state = reducer(initialState, profileOrdersWsMessage(message));
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(50);
    expect(state.totalToday).toBe(5);
  });

  it('should handle profileOrdersWsMessage with missing fields', () => {
    const state = reducer(initialState, profileOrdersWsMessage({}));
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  it('should replace orders on new message', () => {
    const stateWithOrders = {
      ...initialState,
      orders: mockOrders,
      total: 50,
      totalToday: 5,
    };
    const newOrders: Order[] = [
      {
        _id: 'order2',
        ingredients: ['643d69a5c3f7b9001cfa0941'],
        status: 'pending',
        name: 'New order',
        number: 55556,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    ];
    const state = reducer(
      stateWithOrders,
      profileOrdersWsMessage({ orders: newOrders, total: 51, totalToday: 6 })
    );
    expect(state.orders).toEqual(newOrders);
    expect(state.total).toBe(51);
    expect(state.totalToday).toBe(6);
  });
});
