import { Injectable } from '@angular/core';
import { Cliente } from '../../shared/models/cliente.model';
import { Producto } from '../../shared/models/producto.model';
import { Venta } from '../../shared/models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private clientes: Cliente[] = [
    { id: 1, nombre: 'Ana', apellido: 'García', email: 'ana.garcia@email.com', telefono: '555-0101', direccion: 'Av. Principal 123' },
    { id: 2, nombre: 'Carlos', apellido: 'Martínez', email: 'carlos.m@email.com', telefono: '555-0202', direccion: 'Calle Roble 45' },
    { id: 3, nombre: 'María', apellido: 'López', email: 'maria.lopez@email.com', telefono: '555-0303', direccion: 'Jr. Las Flores 78' },
    { id: 4, nombre: 'José', apellido: 'Rodríguez', email: 'jose.r@email.com', telefono: '555-0404', direccion: 'Urb. Los Pinos 12' },
    { id: 5, nombre: 'Lucía', apellido: 'Fernández', email: 'lucia.f@email.com', telefono: '555-0505', direccion: 'Pasaje Azul 9' },
  ];

  private productos: Producto[] = [
    { id: 1, nombre: 'Laptop Pro 15"', descripcion: 'Laptop de alto rendimiento', precio: 1299.99, stock: 15, categoria: 'Electrónica' },
    { id: 2, nombre: 'Mouse Inalámbrico', descripcion: 'Mouse ergonómico inalámbrico', precio: 29.99, stock: 50, categoria: 'Periféricos' },
    { id: 3, nombre: 'Teclado Mecánico', descripcion: 'Teclado mecánico RGB', precio: 89.99, stock: 30, categoria: 'Periféricos' },
    { id: 4, nombre: 'Monitor 27" 4K', descripcion: 'Monitor UHD con panel IPS', precio: 449.99, stock: 10, categoria: 'Electrónica' },
    { id: 5, nombre: 'Auriculares BT', descripcion: 'Auriculares Bluetooth con ANC', precio: 149.99, stock: 25, categoria: 'Audio' },
    { id: 6, nombre: 'Webcam HD', descripcion: 'Cámara web 1080p con micrófono', precio: 69.99, stock: 40, categoria: 'Periféricos' },
    { id: 7, nombre: 'SSD 1TB', descripcion: 'Disco sólido NVMe 1TB', precio: 119.99, stock: 20, categoria: 'Almacenamiento' },
    { id: 8, nombre: 'Hub USB-C', descripcion: 'Hub 7 en 1 USB-C', precio: 49.99, stock: 35, categoria: 'Accesorios' },
  ];

  private ventas: Venta[] = [
    {
      id: 1,
      cliente: this.clientes[0],
      detalles: [
        { producto: this.productos[0], cantidad: 1, precioUnitario: 1299.99, subtotal: 1299.99 },
        { producto: this.productos[1], cantidad: 2, precioUnitario: 29.99, subtotal: 59.98 },
      ],
      fecha: new Date('2025-05-10'),
      total: 1359.97,
      estado: 'completada',
      observaciones: 'Entrega a domicilio'
    },
    {
      id: 2,
      cliente: this.clientes[1],
      detalles: [
        { producto: this.productos[3], cantidad: 1, precioUnitario: 449.99, subtotal: 449.99 },
        { producto: this.productos[2], cantidad: 1, precioUnitario: 89.99, subtotal: 89.99 },
      ],
      fecha: new Date('2025-05-12'),
      total: 539.98,
      estado: 'completada'
    },
    {
      id: 3,
      cliente: this.clientes[2],
      detalles: [
        { producto: this.productos[4], cantidad: 2, precioUnitario: 149.99, subtotal: 299.98 },
      ],
      fecha: new Date('2025-05-15'),
      total: 299.98,
      estado: 'pendiente'
    },
    {
      id: 4,
      cliente: this.clientes[3],
      detalles: [
        { producto: this.productos[6], cantidad: 2, precioUnitario: 119.99, subtotal: 239.98 },
        { producto: this.productos[7], cantidad: 1, precioUnitario: 49.99, subtotal: 49.99 },
      ],
      fecha: new Date('2025-05-17'),
      total: 289.97,
      estado: 'completada'
    },
  ];

  private nextVentaId = 5;

  getClientes(): Cliente[] {
    return [...this.clientes];
  }

  getProductos(): Producto[] {
    return [...this.productos];
  }

  getVentas(): Venta[] {
    return [...this.ventas];
  }

  getVentaById(id: number): Venta | undefined {
    return this.ventas.find(v => v.id === id);
  }

  registrarVenta(venta: Omit<Venta, 'id'>): Venta {
    const nuevaVenta: Venta = { ...venta, id: this.nextVentaId++ };
    // Descontar stock
    nuevaVenta.detalles.forEach(detalle => {
      const prod = this.productos.find(p => p.id === detalle.producto.id);
      if (prod) {
        prod.stock -= detalle.cantidad;
      }
    });
    this.ventas.unshift(nuevaVenta);
    return nuevaVenta;
  }

  eliminarVenta(id: number): boolean {
    const index = this.ventas.findIndex(v => v.id === id);
    if (index !== -1) {
      // Restaurar stock
      this.ventas[index].detalles.forEach(detalle => {
        const prod = this.productos.find(p => p.id === detalle.producto.id);
        if (prod) {
          prod.stock += detalle.cantidad;
        }
      });
      this.ventas.splice(index, 1);
      return true;
    }
    return false;
  }
}
