import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { OwnComponentsModule } from "src/app/components/own-components.module";
import { MessagesPage } from './messages.page';

const routes: Routes = [
  { path: '', component: MessagesPage }
];

@NgModule({
  declarations: [MessagesPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), OwnComponentsModule]
})
export class MessagesPageModule {}