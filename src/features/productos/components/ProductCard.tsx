'use client';

import { ArrowRight } from 'lucide-react';
import type { Product } from '../domain/product';

interface ProductCardProps {
  product: Product;
  onSelectForEncargo?: (product: Product) => void;
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCard({ product, onSelectForEncargo }: ProductCardProps) {
  const handleOrderClick = () => {
    if (onSelectForEncargo) {
      onSelectForEncargo(product);
    }
    const section = document.getElementById('encargos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="group flex flex-col border border-slate-200/80 bg-white transition-all duration-300 hover:border-[#D4A373]/60 hover:shadow-md">
      {/* Contenedor de imagen con categoría flotante */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F8F9FA]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imagen || '/assets/images/Logo.jpg'}
          alt={product.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3.5 top-3.5 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#233140] shadow-xs">
          {product.categoria}
        </span>
      </div>

      {/* Contenido editorial */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#233140] group-hover:text-[#D4A373] transition-colors">
            {product.nombre}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {product.descripcion}
          </p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 flex items-end justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Precio estimado
            </span>
            <span className="font-serif text-lg font-semibold text-[#233140]">
              {formatCOP(Number(product.precio))}{' '}
              <span className="font-sans text-[11px] font-normal text-slate-400">
                COP
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleOrderClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#233140] hover:text-[#D4A373] transition-colors cursor-pointer"
          >
            <span>Pedir por encargo</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </article>
  );
}