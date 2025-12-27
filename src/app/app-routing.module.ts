import { UserRegisterPage } from './pages/userRegister/userRegister.page';
import { LoginPage } from './pages/login/login.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', component: UserRegisterPage },
  //{ path: '', redirectTo: 'prueba-mapa', pathMatch: 'full'  }, //#Para probar el mapa en inicio (en Android no hay URL)
  { path: 'prueba-file-selector', loadComponent: () => import('./pages/prueba-file-selector/prueba-file-selector.page').then( m => m.PruebaFileSelectorPage)},
  { path: 'prueba-mapa', loadComponent: () => import('./pages/prueba-mapa/prueba-mapa.page').then( m => m.PruebaMapaPage)},
  { path: '', component: LoginPage },
  { path: 'userRegister', loadChildren: () => import('./pages/userRegister/userRegister.module').then(m => m.UserRegisterPageModule) },
  { path: 'login',loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule)},
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  { path: 'conversations', loadChildren: () => import('./pages/conversations/conversations.module').then(m => m.ConversationsPageModule)},
  { path: 'messages', loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule)},
  {
    path: 'new-object',
    loadChildren: () => import('./pages/new-object/new-object.module').then( m => m.NewObjectPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
