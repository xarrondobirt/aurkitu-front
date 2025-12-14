import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'userRegister',
        loadComponent: () =>
          import('../userRegister/userRegister.page').then((m) => m.UserRegisterPage),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('../menu/menu.page').then((m) => m.MenuPage),
      },
      {
        path: '',
        redirectTo: '/tabs/userRegister',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/userRegister',
    pathMatch: 'full',
  },
];
