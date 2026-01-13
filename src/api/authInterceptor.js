import { refreshToken as refreshTokenAction } from '@services/slices/authSlice';

import { authApiService } from './api';

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

// Настройка interceptor для authApiService
export const setupAuthInterceptor = () => {
  // Удаляем предыдущие interceptors, если они были добавлены
  if (requestInterceptorId !== null) {
    authApiService.interceptors.request.eject(requestInterceptorId);
  }
  if (responseInterceptorId !== null) {
    authApiService.interceptors.response.eject(responseInterceptorId);
  }

  // Добавляем request interceptor
  requestInterceptorId = authApiService.interceptors.request.use(
    (config) => {
      // Получаем access token из Redux store
      if (store) {
        const state = store.getState();
        const accessToken = state?.auth?.accessToken;
        if (accessToken) {
          // Убираем "Bearer " если он уже есть в токене
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

  // Добавляем response interceptor для автоматического обновления токена
  responseInterceptorId = authApiService.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Если получили 401 и это не запрос на обновление токена
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Если уже идет обновление токена, добавляем запрос в очередь
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return authApiService(originalRequest);
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

          // Обновляем токен через Redux action
          const result = await store.dispatch(refreshTokenAction(refreshToken));

          if (refreshTokenAction.fulfilled.match(result)) {
            const newAccessToken = result.payload.accessToken;

            // Обновляем заголовок и повторяем запрос
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);

            return authApiService(originalRequest);
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
