import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordPage } from './forgot-password.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ForgotPasswordPage }
];

@NgModule({
  declarations: [ForgotPasswordPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes)]
})

export class ForgotPasswordPageModule {}
