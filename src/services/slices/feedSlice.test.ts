import { describe, it, expect } from 'vitest';

import reducer, {
  feedWsOpen,
  feedWsClosed,
  feedWsError,
  feedWsMessage,
} from './feedSlice';

import type { Order } from '@/utils/types';

const mockOrders: Order[] = [
  {
    _id: 'order1',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
    status: 'done',
    name: 'Test order',
    number: 12345,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'order2',
    ingredients: ['643d69a5c3f7b9001cfa093c'],
    status: 'pending',
    name: 'Another order',
    number: 12346,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

describe('feedSlice', () => {
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

  it('should handle feedWsOpen', () => {
    const stateWithError = { ...initialState, error: 'connection error' };
    const state = reducer(stateWithError, feedWsOpen());
    expect(state.isConnected).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle feedWsClosed', () => {
    const connectedState = { ...initialState, isConnected: true };
    const state = reducer(connectedState, feedWsClosed());
    expect(state.isConnected).toBe(false);
  });

  it('should handle feedWsError', () => {
    const state = reducer(initialState, feedWsError('WebSocket error'));
    expect(state.error).toBe('WebSocket error');
  });

  it('should handle feedWsMessage', () => {
    const message = {
      orders: mockOrders,
      total: 100,
      totalToday: 10,
    };
    const state = reducer(initialState, feedWsMessage(message));
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('should handle feedWsMessage with missing fields', () => {
    const state = reducer(initialState, feedWsMessage({}));
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  it('should replace orders on new feedWsMessage', () => {
    const stateWithOrders = {
      ...initialState,
      orders: mockOrders,
      total: 100,
      totalToday: 10,
    };
    const newMessage = {
      orders: [mockOrders[0]],
      total: 101,
      totalToday: 11,
    };
    const state = reducer(stateWithOrders, feedWsMessage(newMessage));
    expect(state.orders).toHaveLength(1);
    expect(state.total).toBe(101);
    expect(state.totalToday).toBe(11);
  });
});
