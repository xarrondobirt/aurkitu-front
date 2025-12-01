import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'userRegister',
        loadChildren: () => import('../userRegister/userRegister.module').then(m => m.UserRegisterPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/userRegister',
        pathMatch: 'full'
      },
      {
        path: 'menu',
        loadChildren: () => import('../menu/menu.module').then(m => m.MenuPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/userRegister',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
