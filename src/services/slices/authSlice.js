import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApiService } from '@api/api';

// Загрузка начального состояния
// Access token НЕ сохраняем в localStorage (best practice - только в памяти)
// Refresh token можно хранить в localStorage
const getInitialState = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const userStr = localStorage.getItem('user');

  return {
    user: userStr ? JSON.parse(userStr) : null,
    accessToken: null, // Хранится только в памяти (Redux state)
    refreshToken: refreshToken || null, // Хранится в localStorage
    isLoading: false,
    isRestoringSession: !!refreshToken, // Флаг восстановления сессии при загрузке
    error: null,
    passwordResetSuccess: false,
  };
};

const initialState = getInitialState();

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApiService.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Более детальная обработка ошибок
      if (error.response) {
        // Сервер ответил с кодом ошибки
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // Запрос был сделан, но ответа не получено
        return rejectWithValue({
          message: 'Network Error: Не удалось подключиться к серверу',
        });
      } else {
        // Что-то пошло не так при настройке запроса
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await authApiService.post('/auth/register', {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error) {
      // Более детальная обработка ошибок
      if (error.response) {
        // Сервер ответил с кодом ошибки
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // Запрос был сделан, но ответа не получено
        return rejectWithValue({
          message: 'Network Error: Не удалось подключиться к серверу',
        });
      } else {
        // Что-то пошло не так при настройке запроса
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email) => {
    const response = await authApiService.post('/password-reset', { email });
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, token }) => {
    const response = await authApiService.post('/password-reset/reset', {
      password,
      token,
    });
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async (refreshToken) => {
  const response = await authApiService.post('/auth/logout', {
    token: refreshToken,
  });
  return response.data;
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshTokenValue) => {
    const response = await authApiService.post('/auth/token', {
      token: refreshTokenValue,
    });
    return response.data;
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApiService.get('/auth/user');
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({
          message: 'Network Error: Не удалось подключиться к серверу',
        });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const body = {};
      if (name !== undefined) body.name = name;
      if (email !== undefined) body.email = email;
      if (password !== undefined && password !== '') body.password = password;

      const response = await authApiService.patch('/auth/user', body);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({
          message: 'Network Error: Не удалось подключиться к серверу',
        });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPasswordResetSuccess: (state) => {
      state.passwordResetSuccess = false;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isRestoringSession = false;
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false; // Сессия установлена через логин
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken; // Только в памяти
        state.refreshToken = action.payload.refreshToken;
        // Сохраняем только refresh token и user в localStorage
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Ошибка при входе';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false; // Сессия установлена через регистрацию
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken; // Только в памяти
        state.refreshToken = action.payload.refreshToken;
        // Сохраняем только refresh token и user в localStorage
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        // Используем payload из rejectWithValue, если он есть
        const errorMessage =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Ошибка при регистрации';
        state.error = errorMessage;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        // Очищаем localStorage
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        // Даже при ошибке очищаем данные на клиенте
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Ошибка при выходе';
      })
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false; // Сессия восстановлена
        state.accessToken = action.payload.accessToken; // Только в памяти
        state.refreshToken = action.payload.refreshToken;
        // Обновляем только refresh token в localStorage
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false; // Восстановление завершено (с ошибкой)
        // При ошибке обновления токена очищаем данные
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Ошибка при обновлении токена';
      })
      // Request password reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Произошла ошибка при восстановлении пароля';
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Произошла ошибка при сбросе пароля';
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // Обновляем user в localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Ошибка при получении данных пользователя';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // Обновляем user в localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          'Ошибка при обновлении данных пользователя';
      });
  },
});

export const { clearError, clearPasswordResetSuccess, clearAuthData } =
  authSlice.actions;

export default authSlice.reducer;
