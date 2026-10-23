const rawHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3001';
const cleanHost = rawHost.replace(/\/$/, '');

export const API_BASE_URL = cleanHost.endsWith('/api')
  ? cleanHost
  : `${cleanHost}/api`;

export const TOKEN_STORAGE_KEY = 'asm_market_token';
export const USER_STORAGE_KEY = 'asm_market_user';