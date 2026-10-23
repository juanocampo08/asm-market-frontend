export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: UserRole;
}

export interface AuthToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: AuthToken;
}