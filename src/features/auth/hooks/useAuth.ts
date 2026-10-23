'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, tokenStorage } from '@/features/common/http';
import type { LoginRequest, RegisterRequest, User } from '../domain/auth';
import { authService } from '../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const syncSessionFromStorage = useCallback(() => {
    const storedUser = tokenStorage.getUser();
    const storedToken = tokenStorage.getToken();

    if (storedUser && storedToken?.accessToken) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsSessionLoaded(true);
  }, []);

  useEffect(() => {
    queueMicrotask(syncSessionFromStorage);

    const handleStorageOrAuthChange = () => {
      syncSessionFromStorage();
    };

    window.addEventListener('auth-change', handleStorageOrAuthChange);
    window.addEventListener('storage', handleStorageOrAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleStorageOrAuthChange);
      window.removeEventListener('storage', handleStorageOrAuthChange);
    };
  }, [syncSessionFromStorage]);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const result = await authService.login(credentials);
      tokenStorage.saveSession(result.token, result.user);
      setUser(result.user);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError('Error inesperado al iniciar sesión');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const result = await authService.register(payload);
      tokenStorage.saveSession(result.token, result.user);
      setUser(result.user);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) {
          setFieldErrors(err.errors);
        } else if (err.status === 409) {
          // 409 email repetido -> lo mostramos directamente junto al campo de correo
          setFieldErrors({ email: err.message });
        }
      } else {
        setError('Error inesperado al registrar la cuenta');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  return {
    user,
    isAuthenticated,
    isSessionLoaded,
    isLoading,
    error,
    fieldErrors,
    login,
    register,
    logout,
    clearErrors,
  };
}