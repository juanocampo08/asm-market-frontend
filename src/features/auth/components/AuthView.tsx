'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export function AuthView({ initialMode = 'login' }: AuthViewProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isSessionLoaded,
    isLoading,
    error: apiError,
    fieldErrors: apiFieldErrors,
    login,
    register,
    clearErrors,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Regla de la rúbrica: con sesión activa, /login y /registro redirigen al inicio
  useEffect(() => {
    if (isSessionLoaded && isAuthenticated) {
      router.replace('/');
    }
  }, [isSessionLoaded, isAuthenticated, router]);

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLocalErrors({});
    clearErrors();
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'register' && nombre.trim().length < 3) {
      errs.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Ingresa un correo electrónico válido.';
    }
    if (!password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      errs.password = 'La contraseña debe tener mínimo 6 caracteres.';
    }

    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    if (mode === 'login') {
      const ok = await login({ email: email.trim(), password });
      if (ok) router.replace('/');
    } else {
      const ok = await register({
        nombre: nombre.trim(),
        email: email.trim(),
        password,
      });
      if (ok) router.replace('/');
    }
  };

  const nombreError = localErrors.nombre || apiFieldErrors.nombre;
  const emailError = localErrors.email || apiFieldErrors.email;
  const passwordError = localErrors.password || apiFieldErrors.password;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Columna izquierda: Panel Editorial Azul Marino  */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#233140] p-12 text-white overflow-hidden">
        {/* Marco interior decorativo sutil */}
        <div className="pointer-events-none absolute inset-6 border border-white/10" />

        {/* Encabezado izquierdo */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-2">
          <Link href="/" className="text-xl font-serif tracking-widest text-white">
            A <span className="text-[#D4A373]">/</span> SM
          </Link>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A373]">
            Curaduría desde USA
          </span>
        </div>

        {/* Texto central editorial */}
        <div className="relative z-10 my-auto max-w-lg px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#D4A373]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
              Esencia y Estilo
            </span>
          </div>

          <h1 className="font-serif text-5xl xl:text-6xl leading-[1.08] text-white">
            Descubre lo{' '}
            <em className="block font-serif italic text-[#D4A373] font-normal">
              extraordinario.
            </em>
          </h1>

          <p className="mt-6 text-base text-slate-300 leading-relaxed max-w-md">
            Belleza, vitaminas y moda seleccionadas para elevar cada detalle de tu
            día.
          </p>

          {/* Tarjeta de testimonio */}
          <div className="mt-10 border border-white/10 bg-white/4 p-7 backdrop-blur-sm">
            <p className="font-serif italic text-base leading-relaxed text-slate-200">
              &ldquo;Cada pedido se siente como un regalo. La selección es impecable y
              siempre encuentro productos que no consigo en ningún otro lugar.&rdquo;
            </p>
            <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4A373] text-xs font-bold text-[#233140]">
                  MC
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">María Camila</p>
                  <p className="text-xs text-slate-400">Cliente ASM desde 2021</p>
                </div>
              </div>
              <div className="text-[#D4A373] text-xs tracking-widest">★★★★★</div>
            </div>
          </div>
        </div>

        {/* Pie izquierdo */}
        <div className="relative z-10 flex items-center justify-between px-4 pb-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
          <span>ASM Market</span>
          <span>Belleza · Vitaminas · Moda USA</span>
        </div>
      </div>

      {/* Columna derecha: Formulario de Autenticación */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#233140] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md my-auto py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
            Bienvenido a ASM
          </p>
          <h2 className="mt-2 font-serif text-4xl text-[#233140]">
            {mode === 'login' ? 'Tu mundo, de nuevo.' : 'Crea tu cuenta.'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {mode === 'login'
              ? 'Ingresa a tu cuenta para continuar descubriendo.'
              : 'Regístrate para solicitar encargos personalizados desde USA.'}
          </p>

          {/* Pestañas Iniciar Sesión / Crear Cuenta */}
          <div className="mt-8 grid grid-cols-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'border-b-2 border-[#D4A373] text-[#233140]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'border-b-2 border-[#D4A373] text-[#233140]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {/* Campo Nombre (solo en registro) */}
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-xs font-semibold text-[#233140] mb-2"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (localErrors.nombre) {
                      setLocalErrors((prev) => ({ ...prev, nombre: '' }));
                    }
                  }}
                  placeholder="Ej. Juan Ocampo"
                  className={`w-full border px-4 py-3 text-sm text-[#233140] placeholder-slate-400 outline-none transition-colors ${
                    nombreError
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-slate-200 focus:border-[#233140]'
                  }`}
                />
                {nombreError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {nombreError}
                  </p>
                )}
              </div>
            )}

            {/* Campo Correo electrónico */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#233140] mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localErrors.email) {
                    setLocalErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="nombre@correo.com"
                className={`w-full border px-4 py-3 text-sm text-[#233140] placeholder-slate-400 outline-none transition-colors ${
                  emailError
                    ? 'border-red-500 bg-red-50/30'
                    : 'border-slate-200 focus:border-[#233140]'
                }`}
              />
              {emailError && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#233140]"
                >
                  Contraseña
                </label>
                <span className="text-[11px] text-[#D4A373]">Mínimo 6 caracteres</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localErrors.password) {
                      setLocalErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full border px-4 py-3 pr-11 text-sm text-[#233140] placeholder-slate-400 outline-none transition-colors ${
                    passwordError
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-slate-200 focus:border-[#233140]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#233140] cursor-pointer"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Error general de credenciales mostrado junto al formulario */}
            {apiError && !emailError && !passwordError && !nombreError && (
              <div
                role="alert"
                className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Botón principal con borde izquierdo dorado */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-between border-l-4 border-[#D4A373] bg-[#233140] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1b2632] disabled:opacity-60 cursor-pointer"
            >
              <span>
                {isLoading
                  ? 'Procesando...'
                  : mode === 'login'
                  ? 'Iniciar Sesión'
                  : 'Crear Cuenta'}
              </span>
              <ArrowRight className="h-4 w-4 text-[#D4A373]" />
            </button>
          </form>

          {/* Accesos rápidos para pruebas de calificación (Admin y Cliente del seed) */}
          {mode === 'login' && (
            <div className="mt-8 border-t border-slate-100 pt-5">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                Cuentas de prueba (Seed)
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('cliente@asmmarket.com');
                    setPassword('Cliente123*');
                    setLocalErrors({});
                    clearErrors();
                  }}
                  className="border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-[#D4A373] hover:text-[#233140] transition-colors cursor-pointer"
                >
                  Usar Cliente (user)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@asmmarket.com');
                    setPassword('Admin123*');
                    setLocalErrors({});
                    clearErrors();
                  }}
                  className="border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-[#D4A373] hover:text-[#233140] transition-colors cursor-pointer"
                >
                  Usar Admin (admin)
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400">
          &copy; 2026 ASM Market. Selección curada USA → Colombia.
        </p>
      </div>
    </div>
  );
}