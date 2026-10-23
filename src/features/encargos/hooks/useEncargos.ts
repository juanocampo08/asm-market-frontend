'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/features/common/http';
import {
  DEFAULT_PAGINATION,
  type Pagination,
} from '@/features/common/ResponseList';
import type { CreateEncargoInput, Encargo } from '../domain/encargo';
import { encargoService } from '../services/encargo.service';

export type EncargosFetchMode = 'none' | 'mios' | 'all';

export function useEncargos(
  mode: EncargosFetchMode = 'none',
  page = 1,
  limit = 10
) {
  const [encargos, setEncargos] = useState<Encargo[]>([]);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState<boolean>(mode !== 'none');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchEncargos = useCallback(async () => {
    if (mode === 'none') return;

    setIsLoading(true);
    setError(null);

    try {
      const response =
        mode === 'mios'
          ? await encargoService.getMine(page, limit)
          : await encargoService.getAll(page, limit);

      setEncargos(response.data);
      const rawMeta = response.pagination ?? response.meta ?? DEFAULT_PAGINATION;
      setPagination({
        total: rawMeta.total ?? response.data.length,
        limit: rawMeta.limit ?? limit,
        page: rawMeta.page ?? rawMeta.currentPage ?? page,
        currentPage: rawMeta.currentPage ?? rawMeta.page ?? page,
        totalPages: rawMeta.totalPages ?? 1,
      });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('No fue posible cargar los encargos.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [mode, page, limit]);

  useEffect(() => {
    if (mode === 'none') return;
    queueMicrotask(() => {
      void fetchEncargos();
    });
  }, [mode, fetchEncargos]);

  const createEncargo = async (
    payload: CreateEncargoInput
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await encargoService.create(payload);
      if (mode !== 'none') {
        await fetchEncargos();
      }
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError('Error inesperado al registrar el encargo.');
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
    encargos,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    reload: fetchEncargos,
    createEncargo,
    clearErrors,
  };
}