import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResetPasswordPage } from './reset-password.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ResetPasswordPage }
];

@NgModule({
  declarations: [ResetPasswordPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes)]
})
export class ResetPasswordPageModule {}