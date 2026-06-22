import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.isLoggedIn()) {
    return true;
  }
  
  return router.parseUrl('/login');
};

const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (!auth.isLoggedIn()) {
    return true;
  }
  
  return router.parseUrl('/map');
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/property-map/property-map.component'),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
