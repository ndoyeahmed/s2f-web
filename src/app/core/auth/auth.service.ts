import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenService = inject(TokenService);
  private readonly tokenKey = 'auth_token';
  user!: any;
  constructor(private readonly router: Router) {}

  login(authRequest: any): Observable<any> {
    return this.http.post<any>('/api/v1/auth/authenticate', authRequest).pipe(
      tap((response) => {
        // localStorage.setItem(this.tokenKey, response.token); // Stocker le token dans le localStorage
        const token = response?.token;
        if (token) {
          // Stocker le token dans le TokenService
          this.tokenService.setToken(token);
          this.connectedUser().subscribe(
            (user) => {
              this.user = user;
              this.tokenService.setConnectedUser(user);
            },
            (err) => {
              console.log(err);
            },
            () => {
              this.dispatchByRole(this.user.role);
            }
          );
          // Rediriger l'utilisateur vers la page Dashboard
        }
      })
    );
  }

  dispatchByRole(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/products']);
        break;
      case 'REVENDEUR':
        this.router.navigate(['/products']);
        break;
      default:
        this.router.navigate(['/products']);
        break;
    }
  }

  // Récupérer le token stocké
  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    this.tokenService.clearConnectedUser();
    this.tokenService.clearToken();
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
