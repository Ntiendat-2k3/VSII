import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Only apply headers and error handling to API requests (relative /api-proxy or local endpoints)
  const isApiRequest = req.url.startsWith('/api-proxy') || req.url.startsWith('http://localhost:4200/api-proxy') || !req.url.startsWith('http');

  if (!isApiRequest) {
    return next(req);
  }

  let modifiedReq = req.clone({
    setHeaders: {
      'Locale': 'vi',
      'X-Request-Id': crypto.randomUUID(),
    }
  });

  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
