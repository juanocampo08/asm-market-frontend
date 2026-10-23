'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Layers,
  ShoppingBag,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Navbar } from '@/features/common/components/Navbar';
import { Footer } from '@/features/common/components/Footer';
import { Pagination } from '@/features/common/components/Pagination';
import { ConfirmDialog } from '@/features/common/components/ConfirmDialog';
import type { Product, ProductInput } from '@/features/productos/domain/product';
import { formatCOP } from '@/features/productos/components/ProductCard';
import { useProducts } from '@/features/productos/hooks/useProducts';
import { useEncargos } from '../hooks/useEncargos';

const PRODUCT_CATEGORIES = ['Beauty', 'Vitaminas', 'Fashion'] as const;

export function AdminDashboardView() {
  const router = useRouter();
  const { user, isAuthenticated, isSessionLoaded } = useAuth();

  const [productsPage, setProductsPage] = useState(1);
  const [encargosPage, setEncargosPage] = useState(1);

  const {
    products,
    pagination: productsPagination,
    isLoading: isLoadingProducts,
    isSubmitting: isSubmittingProduct,
    error: productError,
    fieldErrors: productFieldErrors,
    createProduct,
    updateProduct,
    deleteProduct,
    clearErrors: clearProductErrors,
  } = useProducts({ page: productsPage, limit: 6 });

  const {
    encargos,
    pagination: encargosPagination,
    isLoading: isLoadingEncargos,
    error: encargosError,
  } = useEncargos('all', encargosPage, 8);

  // Estado para el modal Crear / Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState<string>('Beauty');
  const [imagen, setImagen] = useState('/assets/images/Cerave.jpg');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Estado para el diálogo de confirmación de eliminación (+1 pto bonificación)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Protección de ruta por rol:
  // - Sin sesión -> /login
  // - Rol distinto de 'admin' -> /
  useEffect(() => {
    if (!isSessionLoaded) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isSessionLoaded, isAuthenticated, user, router]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('Beauty');
    setImagen('/assets/images/Cerave.jpg');
    setLocalErrors({});
    clearProductErrors();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNombre(product.nombre);
    setDescripcion(product.descripcion);
    setPrecio(String(product.precio));
    setCategoria(product.categoria);
    setImagen(product.imagen || '/assets/images/Cerave.jpg');
    setLocalErrors({});
    clearProductErrors();
    setIsModalOpen(true);
  };

  const validateProductForm = (): boolean => {
    const errs: Record<string, string> = {};
    const numPrecio = Number(precio);

    if (nombre.trim().length < 3) {
      errs.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (descripcion.trim().length < 10) {
      errs.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    }
    if (!precio || Number.isNaN(numPrecio) || numPrecio <= 0) {
      errs.precio = 'Ingresa un precio mayor a 0.';
    }
    if (!categoria) {
      errs.categoria = 'Selecciona una categoría.';
    }
    if (!imagen.trim()) {
      errs.imagen = 'La ruta o URL de la imagen es obligatoria.';
    }

    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    clearProductErrors();
    if (!validateProductForm()) return;

    const payload: ProductInput = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      categoria,
      imagen: imagen.trim(),
      destacado: editingProduct?.destacado ?? false,
      activo: true,
    };

    const ok = editingProduct
      ? await updateProduct(editingProduct.id, payload)
      : await createProduct(payload);

    if (ok) {
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const ok = await deleteProduct(productToDelete.id);
    if (ok) {
      setProductToDelete(null);
    }
  };

  const nombreErr = localErrors.nombre || productFieldErrors.nombre;
  const descripcionErr =
    localErrors.descripcion || productFieldErrors.descripcion;
  const precioErr = localErrors.precio || productFieldErrors.precio;
  const imagenErr = localErrors.imagen || productFieldErrors.imagen;

  if (!isSessionLoaded || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-xs uppercase tracking-widest text-slate-400">
          Verificando permisos de administrador...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Encabezado + KPIs */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#D4A373]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                Panel Administrativo
              </span>
            </div>
            <h1 className="font-serif text-4xl text-[#233140]">
              Buenos días, {user.nombre}.
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Gestiona el inventario curado de ASM Market y supervisa los
              encargos de todos los clientes.
            </p>

            {/* 3 Tarjetas KPI */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Productos Activos
                  </span>
                  <Package className="h-4 w-4 text-[#D4A373]" />
                </div>
                <p className="font-serif text-4xl text-[#233140]">
                  {productsPagination.total ?? products.length}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Referencias en catálogo
                </p>
              </div>

              <div className="border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Categorías
                  </span>
                  <Layers className="h-4 w-4 text-[#D4A373]" />
                </div>
                <p className="font-serif text-4xl text-[#233140]">3</p>
                <p className="mt-1 text-xs text-slate-400">
                  Beauty · Vitaminas · Fashion
                </p>
              </div>

              <div className="bg-[#233140] p-6 text-white">
                <div className="flex items-center justify-between text-[#D4A373] mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Encargos Recibidos
                  </span>
                  <ShoppingBag className="h-4 w-4 text-[#D4A373]" />
                </div>
                <p className="font-serif text-4xl text-white">
                  {encargosPagination.total ?? encargos.length}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Solicitudes totales de clientes
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: Gestión de Catálogo */}
          <section className="border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h2 className="font-serif text-2xl text-[#233140]">
                  Gestión de Catálogo
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Crea nuevos productos, actualiza precios o retira referencias
                  del catálogo público.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 bg-[#D4A373] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#233140] hover:bg-[#c69260] transition-colors cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Producto</span>
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="py-12 text-center text-xs uppercase tracking-widest text-slate-400">
                Cargando inventario...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <th className="py-3 pr-4">Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Precio (COP)</th>
                        <th className="py-3 pl-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {products.map((prod) => (
                        <tr
                          key={prod.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={prod.imagen || '/assets/images/Logo.jpg'}
                                alt={prod.nombre}
                                className="h-12 w-12 shrink-0 object-cover border border-slate-200 bg-[#F8F9FA]"
                              />
                              <div>
                                <p className="font-serif text-base font-medium text-[#233140]">
                                  {prod.nombre}
                                </p>
                                <p className="line-clamp-1 text-slate-400 max-w-md">
                                  {prod.descripcion}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#233140]">
                              {prod.categoria}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#233140]">
                            {formatCOP(Number(prod.precio))}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(prod)}
                                className="inline-flex items-center gap-1 border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#233140] hover:border-[#D4A373] transition-colors cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5 text-[#D4A373]" />
                                <span>Editar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setProductToDelete(prod)}
                                className="inline-flex items-center gap-1 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <Pagination
                    currentPage={
                      productsPagination.currentPage ??
                      productsPagination.page ??
                      productsPage
                    }
                    totalPages={productsPagination.totalPages ?? 1}
                    onPageChange={setProductsPage}
                    isLoading={isLoadingProducts}
                  />
                </div>
              </>
            )}
          </section>

          {/* SECCIÓN 2: Todos los Encargos de Clientes */}
          <section className="border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
            <div className="border-b border-slate-100 pb-6 mb-6">
              <h2 className="font-serif text-2xl text-[#233140]">
                Todos los Encargos de Clientes
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Vista exclusiva de administrador (`GET /api/encargos`) con todas
                las solicitudes registradas en la plataforma.
              </p>
            </div>

            {isLoadingEncargos && (
              <div className="py-12 text-center text-xs uppercase tracking-widest text-slate-400">
                Cargando encargos de clientes...
              </div>
            )}

            {!isLoadingEncargos && encargosError && (
              <p className="py-8 text-center text-xs text-red-600">
                {encargosError}
              </p>
            )}

            {!isLoadingEncargos && !encargosError && encargos.length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">
                Aún no hay encargos registrados.
              </p>
            )}

            {!isLoadingEncargos && !encargosError && encargos.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <th className="py-3 pr-4">Cliente</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Cant.</th>
                        <th className="py-3 px-4">Mensaje / Detalles</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 pl-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {encargos.map((enc) => {
                        const clientName =
                          enc.usuario?.nombre || `Usuario #${enc.usuario_id}`;
                        const clientEmail = enc.usuario?.email || '';
                        const initials = clientName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase();

                        return (
                          <tr
                            key={enc.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#233140] text-[10px] font-bold text-[#D4A373]">
                                  {initials}
                                </span>
                                <div>
                                  <p className="font-semibold text-[#233140]">
                                    {clientName}
                                  </p>
                                  {clientEmail && (
                                    <p className="text-[11px] text-slate-400">
                                      {clientEmail}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-[#233140]">
                              {enc.producto?.nombre ||
                                `Producto #${enc.producto_id}`}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[#233140]">
                              {enc.cantidad}
                            </td>
                            <td className="py-4 px-4 text-slate-500 max-w-xs">
                              <p className="line-clamp-2">{enc.detalles}</p>
                            </td>
                            <td className="py-4 px-4 text-slate-400">
                              {enc.created_at
                                ? new Date(enc.created_at).toLocaleDateString(
                                    'es-CO'
                                  )
                                : 'Reciente'}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <span className="inline-block bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                                {enc.estado}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <Pagination
                    currentPage={
                      encargosPagination.currentPage ??
                      encargosPagination.page ??
                      encargosPage
                    }
                    totalPages={encargosPagination.totalPages ?? 1}
                    onPageChange={setEncargosPage}
                    isLoading={isLoadingEncargos}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A373]">
                  Catálogo ASM Market
                </span>
                <h3 className="font-serif text-2xl text-[#233140]">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#233140] p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#233140] mb-1.5">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. CeraVe Moisturizing Cream"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-sm text-[#233140] outline-none focus:border-[#233140]"
                />
                {nombreErr && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {nombreErr}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#233140] mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#233140] outline-none focus:border-[#233140]"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#233140] mb-1.5">
                    Precio en COP
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="90000"
                    className="w-full border border-slate-200 px-3.5 py-2.5 text-sm text-[#233140] outline-none focus:border-[#233140]"
                  />
                  {precioErr && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {precioErr}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#233140] mb-1.5">
                  Ruta de imagen (en /public/assets/images/...)
                </label>
                <input
                  type="text"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="/assets/images/Cerave.jpg"
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-sm text-[#233140] outline-none focus:border-[#233140]"
                />
                {imagenErr && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {imagenErr}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#233140] mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe los beneficios y características del producto..."
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-sm text-[#233140] outline-none focus:border-[#233140]"
                />
                {descripcionErr && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {descripcionErr}
                  </p>
                )}
              </div>

              {productError &&
                !nombreErr &&
                !descripcionErr &&
                !precioErr &&
                !imagenErr && (
                  <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {productError}
                  </div>
                )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-slate-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="bg-[#233140] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1b2632] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmittingProduct
                    ? 'Guardando...'
                    : editingProduct
                    ? 'Guardar Cambios'
                    : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmación para Eliminar Producto */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        title="¿Eliminar producto del catálogo?"
        message={
          productToDelete ? (
            <span>
              Estás a punto de eliminar{' '}
              <strong className="text-[#233140]">
                {productToDelete.nombre}
              </strong>
              . Esta acción desactivará el producto del catálogo público.
            </span>
          ) : (
            ''
          )
        }
        confirmLabel="Sí, eliminar producto"
        isLoading={isSubmittingProduct}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setProductToDelete(null)}
      />

      <Footer />
    </div>
  );
}