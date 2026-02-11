import { refreshToken as refreshTokenAction } from '@services/slices/authSlice';

import { apiService } from './api';

import type { Store } from '@reduxjs/toolkit';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import type { AppDispatch, RootState } from '@services/types';

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

type ExtendedInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let store: Store<RootState> | null = null;
let requestInterceptorId: number | null = null;
let responseInterceptorId: number | null = null;
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAuthInterceptor = (): void => {
  if (requestInterceptorId !== null) {
    apiService.interceptors.request.eject(requestInterceptorId);
  }
  if (responseInterceptorId !== null) {
    apiService.interceptors.response.eject(responseInterceptorId);
  }

  requestInterceptorId = apiService.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (store) {
        const state = store.getState();
        const accessToken: unknown = state.auth?.accessToken;
        if (accessToken && typeof accessToken === 'string') {
          const token = accessToken.startsWith('Bearer ')
            ? accessToken
            : `Bearer ${accessToken}`;
          config.headers.Authorization = token;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  responseInterceptorId = apiService.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | ExtendedInternalAxiosRequestConfig
        | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Исключаем эндпоинты, которые не требуют авторизации или используются для получения токенов
      const authEndpoints = [
        '/auth/login',
        '/auth/register',
        '/auth/token',
        '/password-reset',
      ];
      const isAuthEndpoint = authEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      );

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          return new Promise<ReturnType<typeof apiService>>((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(apiService(originalRequest));
              },
              reject,
            });
          }).catch((err: Error) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          if (!store) {
            throw new Error('Store is not initialized');
          }

          const state = store.getState();
          const refreshToken = state?.auth?.refreshToken;

          if (!refreshToken || typeof refreshToken !== 'string') {
            throw new Error('No refresh token available');
          }

          const dispatch = store.dispatch as AppDispatch;
          const result = await dispatch(refreshTokenAction(refreshToken));

          if (refreshTokenAction.fulfilled.match(result)) {
            const newAccessToken = result.payload.accessToken;

            if (typeof newAccessToken === 'string') {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              processQueue(null, newAccessToken);

              return apiService(originalRequest);
            } else {
              throw new Error('Invalid access token format');
            }
          } else {
            throw new Error('Failed to refresh token');
          }
        } catch (refreshError) {
          const error =
            refreshError instanceof Error ? refreshError : new Error('Unknown error');
          processQueue(error, null);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export const setStore = (storeInstance: Store<RootState>): void => {
  store = storeInstance;
};
