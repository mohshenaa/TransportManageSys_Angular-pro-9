import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { Router } from '@angular/router';

export const tokenKey: string = 'jwt_token';

export const LoggedIn = signal<boolean>(false);
export const UserName = signal<string | null>(null);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api: string = 'https://localhost:7131/Token';

  constructor(private http: HttpClient, private router: Router) {}
  Login(model: Login): any {
    return this.http.post<Login>(`${this.api}/login`, model);
  }

  Register(model: Register): any {
    return this.http.post<Register>(`${this.api}/register`, model);
  }

  saveToken(token: string, name: string) {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem('name', name);
    LoggedIn.set(true);
    UserName.set(name);
  }

  Logout() {
    LoggedIn.set(false);
    UserName.set('');
    localStorage.removeItem(tokenKey);
    localStorage.removeItem('name');
    this.router.navigate(['login']);
  }

  get Token(): string | null {
    return localStorage.getItem(tokenKey);
  }

  isLoggedIn(): boolean {
    var token = this.Token;
    var name = localStorage.getItem('name');
    if (token) {
      LoggedIn.set(true);
      UserName.set(name);
      return true;
    } else {
      LoggedIn.set(false);
      UserName.set(null);
      return false;
    }
  }
}
