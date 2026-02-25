import { describe, it, expect, beforeEach } from 'vitest';

import reducer, {
  initialState,
  clearError,
  clearPasswordResetSuccess,
  clearAuthData,
  login,
  register,
  logout,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  getUser,
  updateUser,
} from './authSlice';

const mockUser = { email: 'test@test.com', name: 'Test User' };

const mockTokensWithUser = {
  accessToken: 'Bearer access-token',
  refreshToken: 'refresh-token',
  user: mockUser,
};

const mockTokens = {
  accessToken: 'Bearer new-access-token',
  refreshToken: 'new-refresh-token',
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should return the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.passwordResetSuccess).toBe(false);
  });

  describe('sync reducers', () => {
    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = reducer(stateWithError, clearError());
      expect(state.error).toBeNull();
    });

    it('should handle clearPasswordResetSuccess', () => {
      const stateWithSuccess = { ...initialState, passwordResetSuccess: true };
      const state = reducer(stateWithSuccess, clearPasswordResetSuccess());
      expect(state.passwordResetSuccess).toBe(false);
    });

    it('should handle clearAuthData', () => {
      localStorage.setItem('refreshToken', 'some-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      sessionStorage.setItem('redirectAfterLogin', '/profile');

      const stateWithAuth = {
        ...initialState,
        user: mockUser,
        accessToken: 'Bearer token',
        refreshToken: 'refresh-token',
        isRestoringSession: true,
      };
      const state = reducer(stateWithAuth, clearAuthData());

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isRestoringSession).toBe(false);
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(sessionStorage.getItem('redirectAfterLogin')).toBeNull();
    });
  });

  describe('login', () => {
    it('should set isLoading on login.pending', () => {
      const state = reducer(
        initialState,
        login.pending('', { email: '', password: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should clear previous error on login.pending', () => {
      const stateWithError = { ...initialState, error: 'Old error' };
      const state = reducer(
        stateWithError,
        login.pending('', { email: '', password: '' })
      );
      expect(state.error).toBeNull();
    });

    it('should handle login.fulfilled', () => {
      const pendingState = {
        ...initialState,
        isLoading: true,
        isRestoringSession: true,
      };
      const state = reducer(
        pendingState,
        login.fulfilled(mockTokensWithUser, '', { email: '', password: '' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.isRestoringSession).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('Bearer access-token');
      expect(state.refreshToken).toBe('refresh-token');
    });

    it('should handle login.rejected with payload', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        login.rejected(
          null,
          '',
          { email: '', password: '' },
          {
            message: 'Invalid credentials',
          }
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
    });

    it('should handle login.rejected without payload', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        login.rejected(new Error('Network error'), '', { email: '', password: '' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('register', () => {
    it('should set isLoading on register.pending', () => {
      const state = reducer(
        initialState,
        register.pending('', { email: '', password: '', name: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle register.fulfilled', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        register.fulfilled(mockTokensWithUser, '', { email: '', password: '', name: '' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.isRestoringSession).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('Bearer access-token');
      expect(state.refreshToken).toBe('refresh-token');
    });

    it('should handle register.rejected with payload', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        register.rejected(
          null,
          '',
          { email: '', password: '', name: '' },
          {
            message: 'User already exists',
          }
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('User already exists');
    });
  });

  describe('logout', () => {
    it('should set isLoading on logout.pending', () => {
      const state = reducer(initialState, logout.pending('', ''));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle logout.fulfilled', () => {
      localStorage.setItem('refreshToken', 'token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const loggedInState = {
        ...initialState,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh-token',
        isLoading: true,
      };
      const state = reducer(loggedInState, logout.fulfilled({}, '', ''));
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('should clear auth data on logout.rejected', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh-token',
        isLoading: true,
      };
      const state = reducer(
        loggedInState,
        logout.rejected(null, '', '', { message: 'Logout failed' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('refreshToken', () => {
    it('should set isLoading on refreshToken.pending', () => {
      const state = reducer(initialState, refreshToken.pending('', ''));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle refreshToken.fulfilled', () => {
      const pendingState = {
        ...initialState,
        isLoading: true,
        isRestoringSession: true,
      };
      const state = reducer(pendingState, refreshToken.fulfilled(mockTokens, '', ''));
      expect(state.isLoading).toBe(false);
      expect(state.isRestoringSession).toBe(false);
      expect(state.accessToken).toBe('Bearer new-access-token');
      expect(state.refreshToken).toBe('new-refresh-token');
    });

    it('should clear auth data on refreshToken.rejected', () => {
      const stateWithAuth = {
        ...initialState,
        user: mockUser,
        accessToken: 'old-token',
        refreshToken: 'old-refresh',
        isLoading: true,
        isRestoringSession: true,
      };
      const state = reducer(
        stateWithAuth,
        refreshToken.rejected(null, '', '', { message: 'Token expired' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.isRestoringSession).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.error).toBe('Token expired');
    });
  });

  describe('requestPasswordReset', () => {
    it('should set isLoading on requestPasswordReset.pending', () => {
      const state = reducer(initialState, requestPasswordReset.pending('', ''));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.passwordResetSuccess).toBe(false);
    });

    it('should handle requestPasswordReset.fulfilled', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(pendingState, requestPasswordReset.fulfilled({}, '', ''));
      expect(state.isLoading).toBe(false);
      expect(state.passwordResetSuccess).toBe(true);
    });

    it('should handle requestPasswordReset.rejected', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        requestPasswordReset.rejected(null, '', '', {
          message: 'Email not found',
        })
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Email not found');
    });
  });

  describe('resetPassword', () => {
    it('should set isLoading on resetPassword.pending', () => {
      const state = reducer(
        initialState,
        resetPassword.pending('', { password: '', token: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.passwordResetSuccess).toBe(false);
    });

    it('should handle resetPassword.fulfilled', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        resetPassword.fulfilled({}, '', { password: '', token: '' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.passwordResetSuccess).toBe(true);
    });

    it('should handle resetPassword.rejected', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        resetPassword.rejected(
          null,
          '',
          { password: '', token: '' },
          {
            message: 'Invalid token',
          }
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid token');
    });
  });

  describe('getUser', () => {
    it('should set isLoading on getUser.pending', () => {
      const state = reducer(initialState, getUser.pending('', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getUser.fulfilled', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        getUser.fulfilled({ user: mockUser }, '', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('should handle getUser.rejected', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        getUser.rejected(null, '', undefined, {
          message: 'Unauthorized',
        })
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Unauthorized');
    });
  });

  describe('updateUser', () => {
    it('should set isLoading on updateUser.pending', () => {
      const state = reducer(initialState, updateUser.pending('', { name: 'New' }));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle updateUser.fulfilled', () => {
      const updatedUser = { email: 'new@test.com', name: 'Updated Name' };
      const pendingState = { ...initialState, isLoading: true, user: mockUser };
      const state = reducer(
        pendingState,
        updateUser.fulfilled({ user: updatedUser }, '', { name: 'Updated Name' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });

    it('should handle updateUser.rejected', () => {
      const pendingState = { ...initialState, isLoading: true };
      const state = reducer(
        pendingState,
        updateUser.rejected(
          null,
          '',
          { name: '' },
          {
            message: 'Update failed',
          }
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Update failed');
    });
  });
});
