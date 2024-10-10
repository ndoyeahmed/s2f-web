import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tokenKey = 'auth_token';
  constructor(private readonly router: Router) {}

  login(authRequest: any): Observable<any> {
    return this.http.post<any>('/api/v1/auth/authenticate', authRequest).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token); // Stocker le token dans le localStorage
      })
    );
  }

  // Récupérer le token stocké
  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('expires_at');
    localStorage.removeItem('mdd_user');
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isLoggedIn(): boolean {
    return !!this.token();
  }

  connectedUser() {
    return this.http.get<any>('/api/v1/connected-user');
  }
}
