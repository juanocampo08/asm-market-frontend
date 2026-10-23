'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Product } from '@/features/productos/domain/product';
import { formatCOP } from '@/features/productos/components/ProductCard';
import { productService } from '@/features/productos/services/product.service';
import { useEncargos } from '../hooks/useEncargos';

interface EncargoFormSectionProps {
  selectedProduct?: Product | null;
}

export function EncargoFormSection({
  selectedProduct,
}: EncargoFormSectionProps) {
  const router = useRouter();
  const { isAuthenticated, isSessionLoaded } = useAuth();
  const {
    createEncargo,
    isSubmitting,
    error: apiError,
    fieldErrors: apiFieldErrors,
    clearErrors,
  } = useEncargos('none');

  const [catalogOptions, setCatalogOptions] = useState<Product[]>([]);
  const [productoId, setProductoId] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('1');
  const [detalles, setDetalles] = useState<string>('');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  // Cargar todos los productos activos para poblar el selector <select>
  useEffect(() => {
    queueMicrotask(() => {
      void productService
        .getAll({ page: 1, limit: 50 })
        .then((res) => {
          setCatalogOptions(res.data);
        })
        .catch(() => {
          // Si falla silenciosamente, igual podemos usar selectedProduct si existe
        });
    });
  }, []);

  // Sincronizar cuando el usuario pulsa "Pedir por encargo ->" en una tarjeta
  useEffect(() => {
    if (!selectedProduct) return;
    queueMicrotask(() => {
      setProductoId(String(selectedProduct.id));
      setSuccessMessage(false);
      setLocalErrors((prev) => ({ ...prev, producto_id: '' }));
    });
  }, [selectedProduct]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const numProductoId = Number(productoId);
    const numCantidad = Number(cantidad);

    if (!productoId || Number.isNaN(numProductoId) || numProductoId <= 0) {
      errs.producto_id = 'Selecciona un producto del catálogo.';
    }
    if (!cantidad || Number.isNaN(numCantidad) || numCantidad < 1) {
      errs.cantidad = 'La cantidad mínima es 1 unidad.';
    } else if (numCantidad > 50) {
      errs.cantidad = 'La cantidad máxima por encargo es 50 unidades.';
    }
    if (!detalles.trim()) {
      errs.detalles = 'Cuéntanos los detalles de tu solicitud.';
    } else if (detalles.trim().length < 10) {
      errs.detalles = 'Describe tu encargo con al menos 10 caracteres.';
    }

    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setSuccessMessage(false);

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!validate()) return;

    const chosenProduct = catalogOptions.find(
      (p) => p.id === Number(productoId)
    );
    const estimatedBudget = chosenProduct
      ? Number(chosenProduct.precio) * Number(cantidad)
      : undefined;

    const ok = await createEncargo({
      producto_id: Number(productoId),
      cantidad: Number(cantidad),
      presupuesto: estimatedBudget,
      detalles: detalles.trim(),
    });

    if (ok) {
      setSuccessMessage(true);
      setCantidad('1');
      setDetalles('');
    }
  };

  const productoError = localErrors.producto_id || apiFieldErrors.producto_id;
  const cantidadError = localErrors.cantidad || apiFieldErrors.cantidad;
  const detallesError = localErrors.detalles || apiFieldErrors.detalles;

  return (
    <section id="encargos" className="bg-[#233140] py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
          {/* Columna izquierda: Información editorial */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#D4A373]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                Encargos Personalizados
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.12] text-white">
              ¿Tienes algo{' '}
              <em className="font-serif italic font-normal text-[#D4A373]">
                especial
              </em>{' '}
              en mente?
            </h2>

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Si buscas una referencia específica, talla, tono o cantidad de
              nuestro catálogo importado desde Estados Unidos, registra tu
              solicitud y nuestro equipo gestionará la importación directamente
              para ti.
            </p>

            <div className="mt-10 space-y-6 border-t border-white/10 pt-8 max-w-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D4A373]/40 bg-white/5 text-[#D4A373]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Cotización personalizada
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Confirmamos disponibilidad en tiendas oficiales de USA y
                    tiempos estimados de entrega en Colombia.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D4A373]/40 bg-white/5 text-[#D4A373]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Compra protegida 100% original
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Todos nuestros productos son adquiridos directamente en
                    distribuidores autorizados de Estados Unidos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Tarjeta blanca de Solicitud */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 sm:p-10 text-[#233140] shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4A373]">
                  Solicitud / 001
                </span>
                <span className="text-[11px] uppercase tracking-widest text-slate-400">
                  USA → COL
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#233140]">
                Cuéntanos qué necesitas
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Completa los datos de tu encargo para registrarlo en tu cuenta.
              </p>

              {/* Aviso si no ha iniciado sesión */}
              {isSessionLoaded && !isAuthenticated && (
                <div className="mt-5 border-l-4 border-[#D4A373] bg-[#F8F9FA] p-4 text-xs text-slate-600">
                  Para registrar un encargo necesitas tener sesión activa.{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-[#233140] underline hover:text-[#D4A373]"
                  >
                    Inicia sesión o regístrate aquí
                  </Link>
                  .
                </div>
              )}

              {/* Mensaje de éxito */}
              {successMessage && (
                <div className="mt-6 border border-emerald-200 bg-emerald-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-900">
                        ¡Tu encargo ha sido registrado exitosamente!
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Puedes hacer seguimiento del estado de tu solicitud en tu
                        espacio personal.
                      </p>
                      <Link
                        href="/mis-encargos"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#233140] hover:text-[#D4A373]"
                      >
                        <span>Ver Mis Encargos</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                {/* Selector de Producto */}
                <div>
                  <label
                    htmlFor="encargo-producto"
                    className="block text-xs font-semibold text-[#233140] mb-2"
                  >
                    Producto de interés
                  </label>
                  <select
                    id="encargo-producto"
                    value={productoId}
                    onChange={(e) => {
                      setProductoId(e.target.value);
                      if (localErrors.producto_id) {
                        setLocalErrors((prev) => ({ ...prev, producto_id: '' }));
                      }
                    }}
                    className={`w-full border bg-white px-4 py-3 text-xs sm:text-sm text-[#233140] outline-none transition-colors ${
                      productoError
                        ? 'border-red-500 bg-red-50/30'
                        : 'border-slate-200 focus:border-[#233140]'
                    }`}
                  >
                    <option value="">— Selecciona un producto del catálogo —</option>
                    {catalogOptions.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.nombre} ({prod.categoria}) —{' '}
                        {formatCOP(Number(prod.precio))}
                      </option>
                    ))}
                  </select>
                  {productoError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {productoError}
                    </p>
                  )}
                </div>

                {/* Cantidad */}
                <div>
                  <label
                    htmlFor="encargo-cantidad"
                    className="block text-xs font-semibold text-[#233140] mb-2"
                  >
                    Cantidad solicitada
                  </label>
                  <input
                    id="encargo-cantidad"
                    type="number"
                    min={1}
                    max={50}
                    value={cantidad}
                    onChange={(e) => {
                      setCantidad(e.target.value);
                      if (localErrors.cantidad) {
                        setLocalErrors((prev) => ({ ...prev, cantidad: '' }));
                      }
                    }}
                    className={`w-full border px-4 py-3 text-sm text-[#233140] outline-none transition-colors ${
                      cantidadError
                        ? 'border-red-500 bg-red-50/30'
                        : 'border-slate-200 focus:border-[#233140]'
                    }`}
                  />
                  {cantidadError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {cantidadError}
                    </p>
                  )}
                </div>

                {/* Detalles / Especificaciones */}
                <div>
                  <label
                    htmlFor="encargo-detalles"
                    className="block text-xs font-semibold text-[#233140] mb-2"
                  >
                    Especificaciones para el vendedor
                  </label>
                  <textarea
                    id="encargo-detalles"
                    rows={3}
                    value={detalles}
                    onChange={(e) => {
                      setDetalles(e.target.value);
                      if (localErrors.detalles) {
                        setLocalErrors((prev) => ({ ...prev, detalles: '' }));
                      }
                    }}
                    placeholder="Indica talla, color, presentación, ciudad de destino o instrucciones especiales..."
                    className={`w-full border px-4 py-3 text-sm text-[#233140] placeholder-slate-400 outline-none transition-colors ${
                      detallesError
                        ? 'border-red-500 bg-red-50/30'
                        : 'border-slate-200 focus:border-[#233140]'
                    }`}
                  />
                  {detallesError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {detallesError}
                    </p>
                  )}
                </div>

                {/* Error general del API */}
                {apiError && !productoError && !cantidadError && !detallesError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{apiError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-between border-l-4 border-[#D4A373] bg-[#233140] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1b2632] disabled:opacity-60 cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? 'Enviando solicitud...'
                      : isAuthenticated
                      ? 'Solicitar Encargo'
                      : 'Iniciar Sesión para Solicitar'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#D4A373]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}