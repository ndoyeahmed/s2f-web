import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string | null = null;
  private user: any | null = null;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  // Set the token (e.g., after login)
  setToken(token: string): void {
    this.token = token;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token); // Store token in localStorage only on client
    }
  }

  // Get the token
  getToken(): string | null {
    if (this.token) {
      return this.token;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken'); // Retrieve from localStorage only on client
    }
    return this.token;
  }

  // Clear the token (e.g., on logout)
  clearToken(): void {
    this.token = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken'); // Clear token from localStorage only on client
    }
  }

  setConnectedUser(user: any): void {
    this.user = user;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mdd_user', JSON.stringify(user));
    }
  }

  getConnectedUser(): string | null {
    if (this.user) {
      return this.user;
    }
    if (isPlatformBrowser(this.platformId)) {
      // this.user = JSON.parse(localStorage.getItem('mdd_user'));
      const storedUser = localStorage.getItem('mdd_user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      } else {
        this.user = null; // ou gérer l'absence d'utilisateur
      }
    }
    return this.user;
  }

  clearConnectedUser(): void {
    this.user = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('mdd_user');
    }
  }
}
