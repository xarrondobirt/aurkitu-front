import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPage } from './menu.page';
import { RouterModule, Routes } from '@angular/router';
import { OwnComponentsModule } from "src/app/components/own-components.module";

const routes: Routes = [
  { path: '', component: MenuPage }
];

@NgModule({
  declarations: [MenuPage],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), OwnComponentsModule, IonicModule]
})
export class MenuPageModule {}