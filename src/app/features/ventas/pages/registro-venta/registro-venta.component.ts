import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { Cliente } from '../../../../shared/models/cliente.model';
import { Producto } from '../../../../shared/models/producto.model';
import { DetalleVenta } from '../../../../shared/models/venta.model';

interface ItemCarrito {
  producto: Producto | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  errorStock?: string;
}

@Component({
  selector: 'app-registro-venta',
  templateUrl: './registro-venta.component.html',
  styleUrls: ['./registro-venta.component.css'],
  standalone: false
})
export class RegistroVentaComponent implements OnInit {

  clientes: Cliente[] = [];
  productos: Producto[] = [];

  clienteSeleccionadoId: number | null = null;
  observaciones: string = '';
  items: ItemCarrito[] = [];

  errores: { [key: string]: string } = {};
  ventaRegistrada: boolean = false;
  ventaId: number | null = null;
  ventaTotalGuardado: number = 0;
  ventaClienteGuardado: string = '';
  cargando: boolean = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.clientes = this.dataService.getClientes();
    this.productos = this.dataService.getProductos();
    this.agregarItem();
  }

  get clienteSeleccionado(): Cliente | null {
    if (!this.clienteSeleccionadoId) return null;
    return this.clientes.find(c => c.id === +this.clienteSeleccionadoId!) || null;
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get itemsValidos(): ItemCarrito[] {
    return this.items.filter(i => i.producto && i.cantidad > 0);
  }

  agregarItem(): void {
    this.items.push({ producto: null, cantidad: 1, precioUnitario: 0, subtotal: 0 });
  }

  eliminarItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  onProductoChange(index: number, productoId: string): void {
    const item = this.items[index];
    const prod = this.productos.find(p => p.id === +productoId);
    if (prod) {
      item.producto = prod;
      item.precioUnitario = prod.precio;
      item.errorStock = undefined;
      this.calcularSubtotal(index);
    } else {
      item.producto = null;
      item.precioUnitario = 0;
      item.subtotal = 0;
    }
  }

  onCantidadChange(index: number): void {
    this.calcularSubtotal(index);
    this.validarStock(index);
  }

  calcularSubtotal(index: number): void {
    const item = this.items[index];
    item.subtotal = item.precioUnitario * (item.cantidad || 0);
  }

  validarStock(index: number): void {
    const item = this.items[index];
    if (item.producto && item.cantidad > item.producto.stock) {
      item.errorStock = `Stock insuficiente. Disponible: ${item.producto.stock}`;
    } else {
      item.errorStock = undefined;
    }
  }

  productoYaSeleccionado(productoId: number, indexActual: number): boolean {
    return this.items.some((item, i) => i !== indexActual && item.producto?.id === productoId);
  }

  validarFormulario(): boolean {
    this.errores = {};

    if (!this.clienteSeleccionadoId) {
      this.errores['cliente'] = 'Debe seleccionar un cliente.';
    }

    const itemsConProducto = this.items.filter(i => i.producto !== null);
    if (itemsConProducto.length === 0) {
      this.errores['productos'] = 'Debe agregar al menos un producto.';
    }

    let hayErrorStock = false;
    this.items.forEach((item, i) => {
      if (item.producto) {
        if (item.cantidad <= 0) {
          this.errores[`cantidad_${i}`] = 'La cantidad debe ser mayor a cero.';
        }
        if (item.cantidad > item.producto.stock) {
          hayErrorStock = true;
        }
      }
    });

    if (hayErrorStock) {
      this.errores['stock'] = 'Hay productos con stock insuficiente.';
    }

    return Object.keys(this.errores).length === 0;
  }

  registrarVenta(): void {
    if (!this.validarFormulario()) return;

    this.cargando = true;

    const detalles: DetalleVenta[] = this.itemsValidos.map(item => ({
      producto: item.producto!,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal
    }));

    // Guardar datos antes de registrar para mostrarlos en el éxito
    const totalActual = this.total;
    const clienteActual = this.clienteSeleccionado;

    const venta = this.dataService.registrarVenta({
      cliente: clienteActual!,
      detalles,
      fecha: new Date(),
      total: totalActual,
      estado: 'completada',
      observaciones: this.observaciones || undefined
    });

    // Guardar para la pantalla de éxito y mostrar inmediatamente
    this.ventaId = venta.id;
    this.ventaTotalGuardado = totalActual;
    this.ventaClienteGuardado = `${clienteActual?.nombre} ${clienteActual?.apellido}`;
    this.cargando = false;
    this.ventaRegistrada = true;
  }

  nuevaVenta(): void {
    this.clienteSeleccionadoId = null;
    this.observaciones = '';
    this.items = [];
    this.errores = {};
    this.ventaRegistrada = false;
    this.ventaId = null;
    this.agregarItem();
  }

  irAListado(): void {
    this.router.navigate(['/ventas/listado']);
  }
}
