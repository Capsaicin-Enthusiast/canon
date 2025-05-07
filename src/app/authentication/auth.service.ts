import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
  private userId: string | undefined;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.autoAuthUser();
  }

  private getAuthData(): { token: string; expirationDate: Date; userId: string } | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const expirationDateString = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId');
      if (!token || !expirationDateString || !userId) {
        return;
      }
      return { token, expirationDate: new Date(expirationDateString), userId };
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
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresInDuration / 1000);
      this.authStatusListener.next(true);
    } else {
      this.clearAuthData();
    }
  }

  public signUp(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post<void>(`${this.baseUrl}/signup`, authData);
  }

  public login(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http
      .post<{ token: string; expiresIn: number; userId: string }>(`${this.baseUrl}/login`, authData)
      .pipe(
        tap(response => {
          const token = response.token;
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          if (token) {
            this.setAuthTimer(expiresInDuration);
            this.token = token;
            this.isAuthenticated = true;
            if (isPlatformBrowser(this.platformId)) {
              const now = new Date();
              const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
              this.saveAuthData(token, expirationDate, this.userId);
            }
            this.authStatusListener.next(true);
          }
        }),
        catchError(error => {
          this.authStatusListener.next(false);
          return throwError(() => error);
        })
      );
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  public logout(): void {
    this.userId = undefined;
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
      localStorage.removeItem('userId');
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

  getUserId(): string | undefined {
    return this.userId;
  }
}
