import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { getStoredToken, setStoredToken, removeStoredToken, setOnUnauthorizedHandler } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const { error: toastError, success: toastSuccess } = useToast();

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Hook 401 callback into API client
  useEffect(() => {
    setOnUnauthorizedHandler(() => {
      logout();
      toastError('Session Expired', 'Please sign in to continue.');
    });
  }, [logout, toastError]);

  // Initial user check
  const checkAuth = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.getMe();
      setUser(data.user);
      setToken(stored);
    } catch (err) {
      console.warn('Auth check failed:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setStoredToken(response.token);
      setToken(response.token);
      setUser(response.user);
      toastSuccess('Welcome Back!', `Signed in as ${response.user.name}`);
    } catch (err) {
      const message = err?.message || 'Invalid email or password. Please try again.';
      toastError('Login Failed', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(payload);
      setStoredToken(response.token);
      setToken(response.token);
      setUser(response.user);
      toastSuccess('Account Created!', `Welcome to VaultFlow, ${response.user.name}!`);
    } catch (err) {
      const message = err?.message || 'Could not create account. Please check your details.';
      toastError('Registration Failed', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    try {
      const response = await authApi.updateProfile(payload);
      if (response.token) {
        setStoredToken(response.token);
        setToken(response.token);
      }
      setUser(response.user);
      toastSuccess('Profile Updated', 'Your settings have been saved.');
    } catch (err) {
      const message = err?.message || 'Failed to update profile settings.';
      toastError('Update Error', message);
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authApi.getMe();
      setUser(data.user);
    } catch (err) {
      console.warn('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
