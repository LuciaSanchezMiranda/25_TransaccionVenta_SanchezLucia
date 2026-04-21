import { Component, signal } from '@angular/core';

// Interfaz para la Serie
interface Serie {
  id: number;
  nombre: string;
  temporadas: number;
  genero: string;
  anoLanzamiento: number;
  calificacion: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crud-series');

  // Array para almacenar las series
  series: Serie[] = [
    {
      id: 1,
      nombre: 'Breaking Bad',
      temporadas: 5,
      genero: 'Drama/Thriller',
      anoLanzamiento: 2008,
      calificacion: 9.5
    },
    {
      id: 2,
      nombre: 'Stranger Things',
      temporadas: 4,
      genero: 'Ciencia Ficción/Horror',
      anoLanzamiento: 2016,
      calificacion: 8.7
    }
  ];

  // Variables del formulario
  nombre: string = '';
  temporadas: number | null = null;
  genero: string = '';
  anoLanzamiento: number | null = null;
  calificacion: number | null = null;

  // Control de edición
  editando: boolean = false;
  serieEditandoId: number | null = null;

  // Contador de IDs
  proximoId: number = 3;

  // Guardar o actualizar serie
  guardar(): void {
    // Validar que los campos no estén vacíos
    if (!this.nombre || !this.temporadas || !this.genero || !this.anoLanzamiento || !this.calificacion) {
      alert('Por favor, completa todos los campos');
      return;
    }

    if (this.editando && this.serieEditandoId !== null) {
      // Actualizar serie existente
      const index = this.series.findIndex(s => s.id === this.serieEditandoId);
      if (index !== -1) {
        this.series[index] = {
          id: this.serieEditandoId,
          nombre: this.nombre,
          temporadas: this.temporadas,
          genero: this.genero,
          anoLanzamiento: this.anoLanzamiento,
          calificacion: this.calificacion
        };
      }
    } else {
      // Agregar nueva serie
      const nuevaSerie: Serie = {
        id: this.proximoId++,
        nombre: this.nombre,
        temporadas: this.temporadas,
        genero: this.genero,
        anoLanzamiento: this.anoLanzamiento,
        calificacion: this.calificacion
      };
      this.series.push(nuevaSerie);
    }

    this.limpiar();
  }

  // Editar serie
  editar(serie: Serie): void {
    this.nombre = serie.nombre;
    this.temporadas = serie.temporadas;
    this.genero = serie.genero;
    this.anoLanzamiento = serie.anoLanzamiento;
    this.calificacion = serie.calificacion;
    this.editando = true;
    this.serieEditandoId = serie.id;
  }

  // Eliminar serie
  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta serie?')) {
      this.series = this.series.filter(s => s.id !== id);
      if (this.serieEditandoId === id) {
        this.limpiar();
      }
    }
  }

  // Limpiar formulario
  limpiar(): void {
    this.nombre = '';
    this.temporadas = null;
    this.genero = '';
    this.anoLanzamiento = null;
    this.calificacion = null;
    this.editando = false;
    this.serieEditandoId = null;
  }
}
