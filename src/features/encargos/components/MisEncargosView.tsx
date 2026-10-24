'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Plus, PackageOpen, AlertCircle, Calendar, Hash } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Navbar } from '@/features/common/components/Navbar';
import { Footer } from '@/features/common/components/Footer';
import { Pagination } from '@/features/common/components/Pagination';
import { formatCOP } from '@/features/productos/components/ProductCard';
import { useEncargos } from '../hooks/useEncargos';

export function MisEncargosView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { isAuthenticated, isSessionLoaded } = useAuth();
  const { encargos, pagination, isLoading, error, reload } = useEncargos(
    'mios',
    currentPage,
    6
  );

  // Protección de ruta en cliente: si no hay sesión activa, redirige a /login
  useEffect(() => {
    if (isSessionLoaded && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isSessionLoaded, isAuthenticated, router]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Encabezado Editorial */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-slate-200 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-[#D4A373]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                  Tu Espacio Personal
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#233140]">
                Mis Encargos Solicitados
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Consulta el historial y el estado de las importaciones que has
                solicitado desde Estados Unidos.
              </p>
            </div>

            <Link
              href="/#encargos"
              className="inline-flex items-center justify-center gap-2 border-l-4 border-[#D4A373] bg-[#233140] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#1b2632] transition-colors shrink-0"
            >
              <Plus className="h-4 w-4 text-[#D4A373]" />
              <span>Nuevo Encargo</span>
            </Link>
          </div>

          {/* Estado 1: Cargando */}
          {(!isSessionLoaded || isLoading) && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 border border-slate-200 bg-white p-6 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Estado 2: Error */}
          {isSessionLoaded && !isLoading && error && (
            <div className="border border-red-200 bg-white p-10 text-center max-w-lg mx-auto">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-3" />
              <h2 className="font-serif text-xl text-[#233140]">
                No pudimos cargar tus encargos
              </h2>
              <p className="mt-2 text-xs text-slate-500">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="mt-5 bg-[#233140] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#1b2632] cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Estado 3: Lista vacía */}
          {isSessionLoaded && !isLoading && !error && encargos.length === 0 && (
            <div className="border border-slate-200 bg-white p-14 text-center max-w-xl mx-auto">
              <PackageOpen className="mx-auto h-10 w-10 text-[#D4A373] mb-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                Sin solicitudes aún
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#233140]">
                Aún no has realizado ningún encargo
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Explora nuestro catálogo curado desde USA y solicita tu primer
                producto personalizado.
              </p>
              <Link
                href="/#catalogo"
                className="mt-6 inline-block bg-[#233140] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#1b2632] transition-colors"
              >
                Explorar Catálogo
              </Link>
            </div>
          )}

          {/* Estado 4: Tarjetas horizontales de encargos */}
          {isSessionLoaded && !isLoading && !error && encargos.length > 0 && (
            <>
              <div className="space-y-6">
                {encargos.map((encargo) => {
                  const prod = encargo.producto;
                  const unitPrice = prod ? Number(prod.precio) : 0;
                  const formattedDate = encargo.createdAt
                    ? new Date(encargo.createdAt).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Reciente';

                  return (
                    <article
                      key={encargo.id}
                      className="grid grid-cols-1 md:grid-cols-12 border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all hover:border-[#D4A373]/60"
                    >
                      {/* Imagen izquierda con código #ASM */}
                      <div className="relative md:col-span-3 aspect-4/3 md:aspect-auto bg-[#F8F9FA]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod?.imagen || '/assets/images/Logo.jpg'}
                          alt={prod?.nombre || `Encargo #${encargo.id}`}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute left-3 top-3 bg-[#233140]/90 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white">
                          #ASM-{String(encargo.id).padStart(3, '0')}
                        </span>
                      </div>

                      {/* Contenido derecho */}
                      <div className="md:col-span-9 p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                          {/* Píldoras de Categoría y Estado */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <span className="bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#233140]">
                              {prod?.categoria || 'Importación USA'}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                                encargo.estado === 'ENTREGADO'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : encargo.estado === 'EN_PROCESO'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  encargo.estado === 'ENTREGADO'
                                    ? 'bg-emerald-600'
                                    : encargo.estado === 'EN_PROCESO'
                                    ? 'bg-sky-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              {encargo.estado === 'EN_PROCESO'
                                ? 'EN PROCESO'
                                : encargo.estado}
                            </span>
                          </div>

                          {/* Nombre del producto */}
                          <h2 className="font-serif text-2xl text-[#233140]">
                            {prod?.nombre || `Producto #${encargo.productoId}`}
                          </h2>

                          {/* Metadatos en 3 columnas */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-100 py-3.5 text-xs">
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                                Precio unitario
                              </span>
                              <span className="font-semibold text-[#233140]">
                                {unitPrice > 0
                                  ? `${formatCOP(unitPrice)} COP`
                                  : 'Por cotizar'}
                              </span>
                            </div>

                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                                Solicitud
                              </span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#233140]">
                                <Hash className="h-3 w-3 text-[#D4A373]" />
                                Cantidad: {encargo.cantidad}{' '}
                                {encargo.cantidad === 1 ? 'unidad' : 'unidades'}
                              </span>
                            </div>

                            <div>
                              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                                Fecha del encargo
                              </span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#233140]">
                                <Calendar className="h-3 w-3 text-[#D4A373]" />
                                {formattedDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Recuadro crema: Mensaje para el vendedor */}
                        <div className="mt-4 border-l-2 border-[#D4A373] bg-[#FAF7F2] px-4 py-3">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A373] mb-1">
                            Mensaje para el vendedor
                          </span>
                          <p className="text-xs leading-relaxed text-slate-600">
                            {encargo.mensaje}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10">
                <Pagination
                  currentPage={
                    pagination.currentPage ?? pagination.page ?? currentPage
                  }
                  totalPages={pagination.totalPages ?? 1}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}