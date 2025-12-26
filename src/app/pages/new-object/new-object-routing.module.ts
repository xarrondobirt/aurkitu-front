import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewObjectPage } from './new-object.page';

const routes: Routes = [
  {
    path: '',
    component: NewObjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewObjectPageRoutingModule {}
