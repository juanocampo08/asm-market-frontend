import { apiRequest } from '@/features/common/http';
import type { ResponseList } from '@/features/common/ResponseList';
import type { CreateEncargoInput, Encargo } from '../domain/encargo';

export const encargoService = {
  create(payload: CreateEncargoInput): Promise<Encargo> {
    return apiRequest<Encargo>('/encargos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMine(page = 1, limit = 10): Promise<ResponseList<Encargo>> {
    return apiRequest<ResponseList<Encargo>>(
      `/encargos/mios?page=${page}&limit=${limit}`,
      {
        method: 'GET',
      }
    );
  },

  getAll(page = 1, limit = 10): Promise<ResponseList<Encargo>> {
    return apiRequest<ResponseList<Encargo>>(
      `/encargos?page=${page}&limit=${limit}`,
      {
        method: 'GET',
      }
    );
  },
};