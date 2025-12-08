import { UserRegisterPage } from './pages/userRegister/userRegister.page';
import { LoginPage } from './pages/login/login.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', component: UserRegisterPage },
  { path: '', component: LoginPage },
  { path: 'userRegister', loadChildren: () => import('./pages/userRegister/userRegister.module').then(m => m.UserRegisterPageModule) },
  { path: 'login',loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule)},
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}