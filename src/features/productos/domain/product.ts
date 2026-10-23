export type ProductCategory = 'Beauty' | 'Vitaminas' | 'Fashion';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  destacado: boolean;
  activo: boolean;
  created_at?: string;
}

export interface ProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  destacado?: boolean;
  activo?: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoria?: string;
  search?: string;
  minPrecio?: number;
  maxPrecio?: number;
}