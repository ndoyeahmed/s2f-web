import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { MainContentComponent } from './core/layout/main-content/main-content.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import(
            './features/products/pages/product-list/product-list.component'
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'commandes',
        loadComponent: () =>
          import(
            './features/commandes/pages/commandes/commandes.component'
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/pages/login/login.component'),
  },
];
