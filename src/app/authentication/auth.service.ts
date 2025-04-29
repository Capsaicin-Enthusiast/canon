import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private readonly baseUrl = 'http://localhost:3000/api/users';
  private token: string | undefined;
  private tokenTimer: any;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.autoAuthUser();
  }

  private getAuthData(): { token: string; expirationDate: Date } | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const expirationDateString = localStorage.getItem('expiration');
      if (!token || !expirationDateString) {
        return;
      }
      return { token, expirationDate: new Date(expirationDateString) };
    }
    return;
  }

  public autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresInDuration > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresInDuration / 1000);
      this.authStatusListener.next(true);
    } else {
      this.clearAuthData();
    }
  }

  CreateUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post(`${this.baseUrl}/signup`, authData).subscribe({
      next: response => console.log('User created successfully:', response),
      error: error => console.error('Error creating user:', error)
    });
  }

  public login(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string; expiresIn: number }>(`${this.baseUrl}/login`, authData).subscribe({
      next: response => {
        const token = response.token;
        const expiresInDuration = response.expiresIn;
        if (token) {
          this.setAuthTimer(expiresInDuration / 1000);
          this.token = token;
          this.isAuthenticated = true;
          if (isPlatformBrowser(this.platformId)) {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate);
          }
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
        console.log('Login successful:', response);
      },
      error: error => console.error('Error logging in:', error)
    });
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  public logout(): void {
    this.clearAuthData();
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    console.log('User logged out');
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
    }
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken(): string | undefined {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }
}
