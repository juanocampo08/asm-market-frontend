import { apiRequest } from '@/features/common/http';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../domain/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: credentials,
      errorMessage: 'Credenciales inválidas.',
      skipAuthRedirect: true,
    });
    return response.data;
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<{ data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: payload,
      errorMessage: 'No se pudo completar el registro.',
      skipAuthRedirect: true,
    });
    return response.data;
  },
};