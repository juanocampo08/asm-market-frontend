import { API_BASE_URL, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';

export interface StoredToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface StoredUser {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'user';
}

export const tokenStorage = {
  saveSession(token: StoredToken, user: StoredUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      document.cookie = `auth_token=${token.accessToken}; path=/; max-age=${token.expiresIn}; SameSite=Lax`;
      document.cookie = `auth_role=${user.role}; path=/; max-age=${token.expiresIn}; SameSite=Lax`;
      window.dispatchEvent(new Event('auth-change'));
    }
  },

  getToken(): StoredToken | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredToken;
    } catch {
      return null;
    }
  },

  getUser(): StoredUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.dispatchEvent(new Event('auth-change'));
    }
  },
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    errorMessage?: string;
    skipAuthRedirect?: boolean;
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    errorMessage = 'No se pudo completar la operación.',
    skipAuthRedirect = false,
  } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = tokenStorage.getToken();
  if (token?.accessToken) {
    headers['Authorization'] = `Bearer ${token.accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que la API esté encendida.',
      0
    );
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect && typeof window !== 'undefined') {
      tokenStorage.clear();
      if 
      (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login');
      }
    }

    const message =
      (typeof payload.error === 'string' && payload.error) ||
      (typeof payload.message === 'string' && payload.message) ||
      errorMessage;

    const fieldErrors =
      payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)
        ? (payload.errors as Record<string, string>)
        : undefined;

    throw new ApiError(message, response.status, fieldErrors);
  }

  return payload as T;
}