import { apiRequest } from '@/features/common/http';
import type { ResponseList } from '@/features/common/ResponseList';
import type { CreateEncargoInput, Encargo, EncargoEstado } from '../domain/encargo';

export const encargoService = {
  async create(payload: CreateEncargoInput): Promise<Encargo> {
    const res = await apiRequest<{ data: Encargo }>('/encargos', {
      method: 'POST',
      body: payload,
    });
    return res.data;
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

  async updateEstado(id: number, estado: EncargoEstado): Promise<Encargo> {
    const res = await apiRequest<{ data: Encargo }>(`/encargos/${id}/estado`, {
      method: 'PATCH',
      body: { estado },
    });
    return res.data;
  },
};