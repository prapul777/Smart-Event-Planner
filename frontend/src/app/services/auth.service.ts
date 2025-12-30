import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'userInfo';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/login`, { email, password }).pipe(
      map((res: any) => {
        if (res && res.token) {
          this.setToken(res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user || {}));
        }
        return res;
      })
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    // preserve existing localStorage role/org id keys if present
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (!this.token) this.token = localStorage.getItem(this.tokenKey);
    return this.token;
  }

  // Decode JWT and extract role (returns lowercase to keep compatibility with existing guards)
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role as string | undefined;
      return role ? role.toLowerCase() : null;
    } catch (e) {
      return null;
    }
  }
}
