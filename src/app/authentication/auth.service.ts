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

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token = storedToken;
        this.isAuthenticated = true;
      }
    }
    this.authStatusListener.next(this.isAuthenticated);
  }

  CreateUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post(`${this.baseUrl}/signup`, authData).subscribe({
      next: response => console.log('User created successfully:', response),
      error: error => console.error('Error creating user:', error)
    });
  }

  loginUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string }>(`${this.baseUrl}/login`, authData).subscribe({
      next: response => {
        const token = response.token;
        if (token) {
          this.token = token;
          this.isAuthenticated = true;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
          }
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
        console.log('Login successful:', response);
      },
      error: error => console.error('Error logging in:', error)
    });
  }

  logoutUser(): void {
    this.token = undefined;
    this.isAuthenticated = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.authStatusListener.next(false);
    console.log('User logged out');
    this.router.navigate(['/']);
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
