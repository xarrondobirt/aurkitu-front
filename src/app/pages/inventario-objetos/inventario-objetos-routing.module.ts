import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioObjetosPage } from './inventario-objetos.page';

const routes: Routes = [
  {
    path: '',
    component: InventarioObjetosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioObjetosPageRoutingModule {}
