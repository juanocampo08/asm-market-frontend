export type EncargoEstado = 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO';

export interface EncargoUsuario {
  id: number;
  nombre: string;
  email: string;
}

export interface EncargoProducto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
}

export interface Encargo {
  id: number;
  userId: number;
  productoId: number;
  cantidad: number;
  mensaje: string;
  estado: EncargoEstado | string;
  createdAt: string;
  producto?: EncargoProducto;
  user?: EncargoUsuario;
}

export interface CreateEncargoInput {
  productoId: number;
  cantidad: number;
  mensaje: string;
}