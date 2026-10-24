import { apiRequest } from '@/features/common/http';
import type { ResponseList } from '@/features/common/ResponseList';
import type { Product, ProductFilters, ProductInput } from '../domain/product';

function buildQueryString(filters: ProductFilters = {}): string {
  const params = new URLSearchParams();

  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  if (filters.categoria && filters.categoria !== 'Todos') {
    params.set('categoria', filters.categoria);
  }
  if (filters.search && filters.search.trim() !== '') {
    params.set('search', filters.search.trim());
  }
  if (filters.minPrecio !== undefined && !Number.isNaN(filters.minPrecio)) {
    params.set('minPrice', String(filters.minPrecio));
  }
  if (filters.maxPrecio !== undefined && !Number.isNaN(filters.maxPrecio)) {
    params.set('maxPrice', String(filters.maxPrecio));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const productService = {
  getAll(filters: ProductFilters = {}): Promise<ResponseList<Product>> {
    const query = buildQueryString(filters);
    return apiRequest<ResponseList<Product>>(`/productos${query}`, {
      method: 'GET',
    });
  },

  async getById(id: number): Promise<Product> {
    const res = await apiRequest<{ data: Product }>(`/productos/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  async create(payload: ProductInput): Promise<Product> {
    const res = await apiRequest<{ data: Product }>('/productos', {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  async update(id: number, payload: Partial<ProductInput>): Promise<Product> {
    const res = await apiRequest<{ data: Product }>(`/productos/${id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`/productos/${id}`, {
      method: 'DELETE',
    });
  },
};