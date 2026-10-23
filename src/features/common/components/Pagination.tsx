'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  return (
    <nav
      className="flex items-center justify-center gap-8 py-6"
      aria-label="Paginación del catálogo"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className="inline-flex items-center gap-2 border-b border-transparent pb-1 text-sm font-medium text-[#233140] transition-all hover:border-[#233140] disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-transparent cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Anterior
      </button>

      <span className="text-sm text-slate-500">
        Página <strong className="font-semibold text-[#233140]">{currentPage}</strong> de{' '}
        {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="inline-flex items-center gap-2 border-b-2 border-[#233140] pb-1 text-sm font-semibold text-[#233140] transition-all hover:border-[#D4A373] hover:text-[#D4A373] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 cursor-pointer"
      >
        Siguiente
        <ArrowRight className="h-4 w-4" />
      </button>
    </nav>
  );
}