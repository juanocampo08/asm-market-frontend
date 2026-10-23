import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('auth_role')?.value;

  // 1. Con sesión activa, /login y /registro redirigen al inicio (/)
  if ((pathname.startsWith('/login') || pathname.startsWith('/registro')) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Sin sesión activa, rutas protegidas redirigen a /login
  if (
    (pathname.startsWith('/mis-encargos') || pathname.startsWith('/admin')) &&
    !token
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Si un usuario con rol distinto de 'admin' intenta entrar a /admin, redirige a /
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/registro', '/mis-encargos/:path*', '/admin/:path*'],
};