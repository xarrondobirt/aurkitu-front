import { UserRegisterPage } from './pages/userRegister/userRegister.page';
import { LoginPage } from './pages/login/login.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', component: UserRegisterPage },
  { path: '', component: LoginPage },
  { path: 'userRegister', loadChildren: () => import('./pages/userRegister/userRegister.module').then(m => m.UserRegisterPageModule) },
  { path: 'login',loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}