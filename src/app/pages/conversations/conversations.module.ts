import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConversationsPage } from './conversations.page';
import { RouterModule, Routes } from '@angular/router';
import { OwnComponentsModule } from "src/app/components/own-components.module";

const routes: Routes = [
  { path: '', component: ConversationsPage }
];

@NgModule({
  declarations: [ConversationsPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), OwnComponentsModule]
})
export class ConversationsPageModule {}