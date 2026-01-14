import { refreshToken as refreshTokenAction } from '@services/slices/authSlice';

import { apiService } from './api';

let store;
let requestInterceptorId = null;
let responseInterceptorId = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAuthInterceptor = () => {
  if (requestInterceptorId !== null) {
    apiService.interceptors.request.eject(requestInterceptorId);
  }
  if (responseInterceptorId !== null) {
    apiService.interceptors.response.eject(responseInterceptorId);
  }

  requestInterceptorId = apiService.interceptors.request.use(
    (config) => {
      if (store) {
        const state = store.getState();
        const accessToken = state?.auth?.accessToken;
        if (accessToken) {
          const token = accessToken.startsWith('Bearer ')
            ? accessToken
            : `Bearer ${accessToken}`;
          config.headers.Authorization = token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  responseInterceptorId = apiService.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

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
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiService(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const state = store.getState();
          const refreshToken = state?.auth?.refreshToken;

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const result = await store.dispatch(refreshTokenAction(refreshToken));

          if (refreshTokenAction.fulfilled.match(result)) {
            const newAccessToken = result.payload.accessToken;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);

            return apiService(originalRequest);
          } else {
            throw new Error('Failed to refresh token');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export const setStore = (storeInstance) => {
  store = storeInstance;
};
