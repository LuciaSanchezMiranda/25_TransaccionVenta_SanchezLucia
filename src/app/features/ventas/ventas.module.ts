import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ListadoVentasComponent } from './pages/listado-ventas/listado-ventas.component';
import { RegistroVentaComponent } from './pages/registro-venta/registro-venta.component';

const routes: Routes = [
  { path: '',        redirectTo: 'listado', pathMatch: 'full' },
  { path: 'listado', component: ListadoVentasComponent },
  { path: 'nueva',   component: RegistroVentaComponent },
];

@NgModule({
  declarations: [
    ListadoVentasComponent,
    RegistroVentaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class VentasModule {}
