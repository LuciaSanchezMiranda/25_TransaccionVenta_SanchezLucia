import { Cliente } from './cliente.model';
import { Producto } from './producto.model';

export interface DetalleVenta {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  cliente: Cliente;
  detalles: DetalleVenta[];
  fecha: Date;
  total: number;
  estado: 'completada' | 'pendiente' | 'cancelada';
  observaciones?: string;
}
