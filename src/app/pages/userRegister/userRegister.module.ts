import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserRegisterPage } from './userRegister.page';
import { RouterModule, Routes } from '@angular/router';
import { ExploreContainerComponent } from "src/app/explore-container/explore-container.component";

const routes: Routes = [
  { path: '', component: UserRegisterPage }
];

@NgModule({
  declarations: [UserRegisterPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes), ExploreContainerComponent]
})
export class UserRegisterPageModule {}