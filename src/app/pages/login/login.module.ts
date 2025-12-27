import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { RouterModule, Routes } from '@angular/router';
import { OwnComponentsModule } from "src/app/components/own-components.module";

const routes: Routes = [
  { path: '', component: LoginPage }
];

@NgModule({
  declarations: [LoginPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes), OwnComponentsModule]
})
export class LoginPageModule {}
