import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AUTH_ENDPOINTS } from '../../constants/endpoints.constant';

import { environment } from '../../../environments/environment';

export interface LoginFormData {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  code: string;
  data: {
    accessToken: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Initialize from localStorage
  readonly isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  login(credentials: LoginFormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}${AUTH_ENDPOINTS.LOGIN}`, credentials).pipe(
      tap(response => {
        const token = response.data?.accessToken;
        if (token) {
          localStorage.setItem('token', token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }
}
