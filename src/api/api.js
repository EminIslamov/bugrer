import axios from 'axios';

export const BASE_URL = 'https://norma.education-services.ru/api';

/**
 * Базовый экземпляр axios с предустановленной конфигурацией
 */
export const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor для обработки запросов
 * Можно добавить токен авторизации и другую логику
 */
apiService.interceptors.request.use(
  (config) => {
    // Здесь можно добавить токен авторизации
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor для обработки ответов
 * Обработка ошибок и успешных ответов
 */
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Обработка ошибок
    if (error.response) {
      // Сервер ответил с кодом ошибки
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Запрос был сделан, но ответа не получено
      console.error('Network Error:', error.request);
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiService;
