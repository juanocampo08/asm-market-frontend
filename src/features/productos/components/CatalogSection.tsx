'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, AlertCircle } from 'lucide-react';
import { Pagination } from '@/features/common/components/Pagination';
import type { Product } from '../domain/product';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  onSelectProductForEncargo?: (product: Product) => void;
}

const CATEGORIES = ['Todos', 'Beauty', 'Vitaminas', 'Fashion'] as const;

export function CatalogSection({ onSelectProductForEncargo }: CatalogSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Leemos el estado actual desde la URL )
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategoria = searchParams.get('categoria') || 'Todos';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrecio = searchParams.get('minPrecio')
    ? Number(searchParams.get('minPrecio'))
    : undefined;
  const currentMaxPrecio = searchParams.get('maxPrecio')
    ? Number(searchParams.get('maxPrecio'))
    : undefined;

  // Estados locales para los inputs antes de aplicar o mientras escribe
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minInput, setMinInput] = useState(
    currentMinPrecio !== undefined ? String(currentMinPrecio) : ''
  );
  const [maxInput, setMaxInput] = useState(
    currentMaxPrecio !== undefined ? String(currentMaxPrecio) : ''
  );

  const { products, pagination, isLoading, error, reload } = useProducts({
    page: currentPage,
    limit: 6,
    categoria: currentCategoria === 'Todos' ? undefined : currentCategoria,
    search: currentSearch || undefined,
    minPrecio: currentMinPrecio,
    maxPrecio: currentMaxPrecio,
  });

  const updateUrlParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'Todos') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}#catalogo` : `${pathname}#catalogo`, {
      scroll: false,
    });
  };

  const handleCategoryChange = (cat: string) => {
    updateUrlParams({
      categoria: cat === 'Todos' ? undefined : cat,
      page: '1',
    });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({
      search: searchInput.trim() || undefined,
      minPrecio: minInput.trim() || undefined,
      maxPrecio: maxInput.trim() || undefined,
      page: '1',
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setMinInput('');
    setMaxInput('');
    router.push(`${pathname}#catalogo`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: String(newPage) });
  };

  const hasActiveFilters =
    currentCategoria !== 'Todos' ||
    Boolean(currentSearch) ||
    currentMinPrecio !== undefined ||
    currentMaxPrecio !== undefined;

  return (
    <section id="catalogo" className="py-20 bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado Editorial */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#D4A373]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                Nuestra Selección
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#233140]">
              Descubre algo{' '}
              <em className="font-serif italic font-normal text-[#D4A373]">
                extraordinario
              </em>
            </h2>
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Mostrando {products.length} de {pagination.total} productos exclusivos
          </p>
        </div>

        {/* Barra de Filtros Combinados */}
        <form
          onSubmit={handleFilterSubmit}
          className="mb-10 border border-slate-200 bg-white p-5 shadow-2xs"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
            {/* Buscador por texto */}
            <div className="lg:col-span-4">
              <label
                htmlFor="catalog-search"
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2"
              >
                Buscar productos
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="catalog-search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ej. CeraVe, Centrúm, Tommy..."
                  className="w-full border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-[#233140] placeholder-slate-400 outline-none focus:border-[#233140]"
                />
              </div>
            </div>

            {/* Píldoras de Categoría */}
            <div className="lg:col-span-4">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Categoría
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.map((cat) => {
                  const active = currentCategoria === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`py-2.5 px-2 text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#233140] text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-[#D4A373] hover:text-[#233140]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rango de Precios + Botón Aplicar */}
            <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-2 items-end">
              <div>
                <label
                  htmlFor="min-precio"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2"
                >
                  Precio mín.
                </label>
                <input
                  id="min-precio"
                  type="number"
                  min={0}
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                  placeholder="$ 0"
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs text-[#233140] placeholder-slate-400 outline-none focus:border-[#233140]"
                />
              </div>

              <div>
                <label
                  htmlFor="max-precio"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2"
                >
                  Precio máx.
                </label>
                <input
                  id="max-precio"
                  type="number"
                  min={0}
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  placeholder="$ 300.000"
                  className="w-full border border-slate-200 px-3 py-2.5 text-xs text-[#233140] placeholder-slate-400 outline-none focus:border-[#233140]"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 flex gap-1.5">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#233140] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1b2632] transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#D4A373]" />
                  <span>Filtrar</span>
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    title="Limpiar filtros"
                    className="border border-slate-200 px-2.5 py-2.5 text-slate-500 hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Estado 1: Cargando (Skeletons) */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-slate-200 bg-white p-4 animate-pulse"
              >
                <div className="aspect-4/3 w-full bg-slate-200 mb-4" />
                <div className="h-5 w-2/3 bg-slate-200 mb-2" />
                <div className="h-3 w-full bg-slate-100 mb-1" />
                <div className="h-3 w-4/5 bg-slate-100 mb-6" />
                <div className="h-8 w-full bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Estado 2: Error del servidor */}
        {!isLoading && error && (
          <div className="border border-red-200 bg-white p-10 text-center max-w-lg mx-auto">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-3" />
            <h3 className="font-serif text-xl text-[#233140]">
              No pudimos cargar el catálogo
            </h3>
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
        {!isLoading && !error && products.length === 0 && (
          <div className="border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
              Sin resultados
            </p>
            <h3 className="mt-2 font-serif text-2xl text-[#233140]">
              No encontramos productos con esos filtros
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Prueba limpiando los filtros o solicita este producto directamente en
              nuestra sección de encargos personalizados.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 border border-[#233140] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#233140] hover:bg-[#233140] hover:text-white transition-colors cursor-pointer"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}

        {/* Estado 4: Grilla de Productos + Paginación */}
        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectForEncargo={onSelectProductForEncargo}
                />
              ))}
            </div>

            <div className="mt-12">
                <Pagination
                    currentPage={pagination.currentPage ?? pagination.page ?? currentPage}
                    totalPages={pagination.totalPages ?? 1}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                />
            </div>
          </>
        )}
      </div>
    </section>
  );
}