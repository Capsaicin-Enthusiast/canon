import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/api/users';
  private token: string | undefined;

  constructor(private readonly http: HttpClient) { }

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
        this.token = token;
        localStorage.setItem('token', token);
        console.log('Login successful:', response);
      },
      error: error => console.error('Error logging in:', error)
    });
  }

  logoutUser(): void {
    this.token = undefined;
    localStorage.removeItem('token');
    console.log('User logged out');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | undefined {
    return this.token;
  }
}
