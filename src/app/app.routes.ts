import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  /*{
    path: 'prueba-file-selector',
    loadComponent: () => import('./pages/prueba-file-selector/prueba-file-selector.page').then( m => m.PruebaFileSelectorPage)
  },
  {
    path: 'prueba-mapa',
    loadComponent: () => import('./pages/prueba-mapa/prueba-mapa.page').then( m => m.PruebaMapaPage)
  },*/

];
