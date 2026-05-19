import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { Venta } from '../../../../shared/models/venta.model';

type SortField = 'id' | 'cliente' | 'fecha' | 'total' | 'productos';
type SortDir   = 'asc' | 'desc';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css'],
  standalone: false
})
export class ListadoVentasComponent implements OnInit {

  ventas: Venta[] = [];
  filtradas: Venta[] = [];

  busqueda: string = '';
  filtroEstado: string = '';
  sortField: SortField = 'id';
  sortDir: SortDir = 'desc';

  ventaDetalle: Venta | null = null;
  confirmandoEliminar: number | null = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventas = this.dataService.getVentas();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.ventas];

    if (this.busqueda.trim()) {
      const q = this.busqueda.toLowerCase();
      resultado = resultado.filter(v =>
        v.cliente.nombre.toLowerCase().includes(q) ||
        v.cliente.apellido.toLowerCase().includes(q) ||
        v.id.toString().includes(q)
      );
    }

    if (this.filtroEstado) {
      resultado = resultado.filter(v => v.estado === this.filtroEstado);
    }

    resultado = this.ordenar(resultado);
    this.filtradas = resultado;
  }

  ordenar(lista: Venta[]): Venta[] {
    return lista.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (this.sortField) {
        case 'id':       valA = a.id;                                          valB = b.id;                                          break;
        case 'cliente':  valA = `${a.cliente.nombre} ${a.cliente.apellido}`;   valB = `${b.cliente.nombre} ${b.cliente.apellido}`;   break;
        case 'fecha':    valA = new Date(a.fecha).getTime();                   valB = new Date(b.fecha).getTime();                   break;
        case 'total':    valA = a.total;                                       valB = b.total;                                       break;
        case 'productos':valA = a.detalles.length;                             valB = b.detalles.length;                             break;
      }

      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }

  toggleSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.aplicarFiltros();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return 'fa-sort';
    return this.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  verDetalle(venta: Venta): void {
    this.ventaDetalle = venta;
  }

  cerrarDetalle(): void {
    this.ventaDetalle = null;
  }

  confirmarEliminar(id: number): void {
    this.confirmandoEliminar = id;
  }

  cancelarEliminar(): void {
    this.confirmandoEliminar = null;
  }

  eliminarVenta(): void {
    if (this.confirmandoEliminar !== null) {
      this.dataService.eliminarVenta(this.confirmandoEliminar);
      this.confirmandoEliminar = null;
      if (this.ventaDetalle?.id === this.confirmandoEliminar) {
        this.ventaDetalle = null;
      }
      this.cargarVentas();
    }
  }

  nuevaVenta(): void {
    this.router.navigate(['/ventas/nueva']);
  }

  get totalVentas(): number {
    return this.ventas.reduce((s, v) => s + v.total, 0);
  }

  get ventasCompletadas(): number {
    return this.ventas.filter(v => v.estado === 'completada').length;
  }

  get ventasPendientes(): number {
    return this.ventas.filter(v => v.estado === 'pendiente').length;
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }
}
