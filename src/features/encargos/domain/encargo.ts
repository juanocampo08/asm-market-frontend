import type { Product } from '@/features/productos/domain/product';

export type EncargoEstado = 'pendiente' | 'entregado' | 'cancelado';

export interface EncargoUsuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Encargo {
  id: number;
  usuario_id: number;
  producto_id: number;
  cantidad: number;
  presupuesto: number | null;
  detalles: string;
  estado: EncargoEstado | string;
  created_at: string;
  producto?: Product;
  usuario?: EncargoUsuario;
}

export interface CreateEncargoInput {
  producto_id: number;
  cantidad: number;
  presupuesto?: number;
  detalles: string;
}