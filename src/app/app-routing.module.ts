import { UserRegisterPage } from './pages/userRegister/userRegister.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: UserRegisterPage },
  { path: 'userRegister', loadChildren: () => import('./pages/userRegister/userRegister.module').then(m => m.UserRegisterPageModule) },
  { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}