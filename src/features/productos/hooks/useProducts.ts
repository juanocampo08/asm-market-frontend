'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/features/common/http';
import {
  DEFAULT_PAGINATION,
  type Pagination,
} from '@/features/common/ResponseList';
import type { Product, ProductFilters, ProductInput } from '../domain/product';
import { productService } from '../services/product.service';

export function useProducts(
  initialFilters: ProductFilters = { page: 1, limit: 6 }
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const page = initialFilters.page ?? 1;
  const limit = initialFilters.limit ?? 6;
  const categoria = initialFilters.categoria ?? '';
  const search = initialFilters.search ?? '';
  const minPrecio = initialFilters.minPrecio;
  const maxPrecio = initialFilters.maxPrecio;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getAll({
        page,
        limit,
        categoria: categoria || undefined,
        search: search || undefined,
        minPrecio,
        maxPrecio,
      });
      setProducts(response.data);
      const rawMeta = response.pagination ?? response.meta ?? DEFAULT_PAGINATION;
      setPagination({
        total: rawMeta.total ?? 0,
        limit: rawMeta.limit ?? limit,
        page: rawMeta.page ?? rawMeta.currentPage ?? page,
        currentPage: rawMeta.currentPage ?? rawMeta.page ?? page,
        totalPages: rawMeta.totalPages ?? 1,
      });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('No fue posible cargar el catálogo de productos.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, categoria, search, minPrecio, maxPrecio]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchProducts();
    });
  }, [fetchProducts]);

  const createProduct = async (payload: ProductInput): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await productService.create(payload);
      await fetchProducts();
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError('Error inesperado al crear el producto.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async (
    id: number,
    payload: Partial<ProductInput>
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await productService.update(id, payload);
      await fetchProducts();
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError('Error inesperado al actualizar el producto.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await productService.remove(id);
      await fetchProducts();
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error inesperado al eliminar el producto.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  return {
    products,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    reload: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearErrors,
  };
}