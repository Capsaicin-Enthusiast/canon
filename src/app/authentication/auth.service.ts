import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/api/users';

  constructor(private readonly http: HttpClient) { }

  CreateUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post(`${this.baseUrl}/signup`, authData).subscribe(
      response => console.log('User created successfully:', response)
    );
  }
}
