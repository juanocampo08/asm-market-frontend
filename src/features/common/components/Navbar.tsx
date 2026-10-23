'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push('/');
  };

  const linkStyle = (active: boolean) =>
    `text-sm font-medium transition-colors pb-1 ${
      active
        ? 'text-[#233140] border-b-2 border-[#D4A373]'
        : 'text-slate-600 hover:text-[#233140]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8"
        aria-label="Navegación principal"
      >

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 group"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-[#D4A373] text-base font-serif text-[#D4A373] transition-transform group-hover:scale-105">
            A
          </span>
          <span className="text-lg tracking-wide text-[#233140]">
            <strong className="font-bold">ASM</strong>{' '}
            <em className="font-serif italic text-[#D4A373]">Market</em>
          </span>
        </Link>

        {/* Enlaces centrales en escritorio */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#catalogo" className={linkStyle(pathname === '/')}>
            Catálogo
          </Link>
          <Link href="/#encargos" className="text-sm font-medium text-slate-600 hover:text-[#233140] transition-colors pb-1">
            Solicitar Encargo
          </Link>
          {isAuthenticated && (
            <Link
              href="/mis-encargos"
              className={linkStyle(pathname.startsWith('/mis-encargos'))}
            >
              Mis Encargos
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              href="/admin"
              className={linkStyle(pathname.startsWith('/admin'))}
            >
              Administración
            </Link>
          )}
        </div>

        {/* Estado de sesión a la derecha en escritorio */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated || !user ? (
            <Link
              href="/login"
              className="bg-[#233140] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#1b2632]"
            >
              Ingresar
            </Link>
          ) : (
            <div className="flex items-center gap-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#233140] text-xs font-semibold text-white">
                {getInitials(user.nombre)}
              </span>
              <div className="text-left">
                <p className="text-sm font-medium text-[#233140] leading-tight">
                  {user.nombre}
                </p>
                {user.role === 'admin' && (
                  <p className="text-[10px] uppercase tracking-wider text-[#D4A373] font-semibold">
                    Administrador
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 text-[#233140] md:hidden"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden flex flex-col gap-4">
          <Link
            href="/#catalogo"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-[#233140]"
          >
            Catálogo
          </Link>
          <Link
            href="/#encargos"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-[#233140]"
          >
            Solicitar Encargo
          </Link>
          {isAuthenticated && (
            <Link
              href="/mis-encargos"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[#233140]"
            >
              Mis Encargos
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[#D4A373]"
            >
              Administración
            </Link>
          )}

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            {!isAuthenticated || !user ? (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-[#233140] py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white"
              >
                Ingresar
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#233140] text-xs font-semibold text-white">
                    {getInitials(user.nombre)}
                  </span>
                  <span className="text-sm font-medium text-[#233140]">
                    {user.nombre}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold uppercase tracking-wider text-red-600"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}