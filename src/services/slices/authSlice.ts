import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiService } from '@api/api';

import type { AxiosError } from 'axios';

import type { RootState } from '@services/types';

type AuthUser = {
  email: string;
  name: string;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isRestoringSession: boolean;
  error: string | null;
  passwordResetSuccess: boolean;
};

type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
};

type AuthTokensWithUserResponse = AuthTokensResponse & {
  user: AuthUser;
};

type AuthUserResponse = {
  user: AuthUser;
};

type AuthMessageResponse = {
  message?: string;
  success?: boolean;
};

type AuthRejectValue = {
  message: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

type UpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
};

type ResetPasswordPayload = {
  password: string;
  token: string;
};

const getStoredUser = (): AuthUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as AuthUser;
  } catch {
    return null;
  }
};

// Access token хранится только в памяти
// Refresh token хранится в localStorage
const getInitialState = (): AuthState => {
  const refreshToken = localStorage.getItem('refreshToken');

  return {
    user: getStoredUser(),
    accessToken: null,
    refreshToken: refreshToken || null,
    isLoading: false,
    isRestoringSession: !!refreshToken,
    error: null,
    passwordResetSuccess: false,
  };
};

const initialState = getInitialState();

export const login = createAsyncThunk<
  AuthTokensWithUserResponse,
  LoginPayload,
  { rejectValue: AuthRejectValue }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await apiService.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message: axiosError.response.data?.message || 'Ошибка при входе',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({ message: axiosError.message || 'Ошибка при входе' });
  }
});

export const register = createAsyncThunk<
  AuthTokensWithUserResponse,
  RegisterPayload,
  { rejectValue: AuthRejectValue }
>('auth/register', async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const response = await apiService.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message: axiosError.response.data?.message || 'Ошибка при регистрации',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({ message: axiosError.message || 'Ошибка при регистрации' });
  }
});

export const requestPasswordReset = createAsyncThunk<
  AuthMessageResponse,
  string,
  { rejectValue: AuthRejectValue }
>('auth/requestPasswordReset', async (email, { rejectWithValue }) => {
  try {
    const response = await apiService.post('/password-reset', { email });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message:
          axiosError.response.data?.message ||
          'Произошла ошибка при восстановлении пароля',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({
      message: axiosError.message || 'Произошла ошибка при восстановлении пароля',
    });
  }
});

export const resetPassword = createAsyncThunk<
  AuthMessageResponse,
  ResetPasswordPayload,
  { rejectValue: AuthRejectValue }
>('auth/resetPassword', async ({ password, token }, { rejectWithValue }) => {
  try {
    const response = await apiService.post('/password-reset/reset', {
      password,
      token,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message:
          axiosError.response.data?.message || 'Произошла ошибка при сбросе пароля',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({
      message: axiosError.message || 'Произошла ошибка при сбросе пароля',
    });
  }
});

export const logout = createAsyncThunk<
  AuthMessageResponse,
  string,
  { rejectValue: AuthRejectValue }
>('auth/logout', async (refreshToken, { rejectWithValue }) => {
  try {
    const response = await apiService.post('/auth/logout', {
      token: refreshToken,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message: axiosError.response.data?.message || 'Ошибка при выходе',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({ message: axiosError.message || 'Ошибка при выходе' });
  }
});

export const refreshToken = createAsyncThunk<
  AuthTokensResponse,
  string,
  { rejectValue: AuthRejectValue }
>('auth/refreshToken', async (refreshTokenValue, { rejectWithValue }) => {
  try {
    const response = await apiService.post('/auth/token', {
      token: refreshTokenValue,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message: axiosError.response.data?.message || 'Ошибка при обновлении токена',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({
      message: axiosError.message || 'Ошибка при обновлении токена',
    });
  }
});

export const getUser = createAsyncThunk<
  AuthUserResponse,
  void,
  { rejectValue: AuthRejectValue }
>('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get('/auth/user');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message:
          axiosError.response.data?.message ||
          'Ошибка при получении данных пользователя',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({
      message: axiosError.message || 'Ошибка при получении данных пользователя',
    });
  }
});

export const updateUser = createAsyncThunk<
  AuthUserResponse,
  UpdateUserPayload,
  { rejectValue: AuthRejectValue }
>('auth/updateUser', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const body: UpdateUserPayload = {};
    if (name !== undefined) body.name = name;
    if (email !== undefined) body.email = email;
    if (password !== undefined && password !== '') body.password = password;

    const response = await apiService.patch('/auth/user', body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthMessageResponse>;

    if (axiosError.response) {
      return rejectWithValue({
        message:
          axiosError.response.data?.message ||
          'Ошибка при обновлении данных пользователя',
      });
    }
    if (axiosError.request) {
      return rejectWithValue({
        message: 'Network Error: Не удалось подключиться к серверу',
      });
    }
    return rejectWithValue({
      message: axiosError.message || 'Ошибка при обновлении данных пользователя',
    });
  }
});

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
      sessionStorage.removeItem('redirectAfterLogin');
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
        state.isRestoringSession = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || action.error?.message || 'Ошибка при входе';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || action.error?.message || 'Ошибка при регистрации';
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
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('redirectAfterLogin');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('redirectAfterLogin');
        state.error =
          action.payload?.message || action.error?.message || 'Ошибка при выходе';
      })
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isRestoringSession = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        state.error =
          action.payload?.message ||
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          'Ошибка при обновлении данных пользователя';
      });
  },
});

export const { clearError, clearPasswordResetSuccess, clearAuthData } =
  authSlice.actions;

export const selectIsLoggedIn = (state: RootState): boolean =>
  !!(state.auth.refreshToken && state.auth.accessToken);

export default authSlice.reducer;
