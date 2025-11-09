import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest } from '../../feature/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  //TODO: move to env
  private readonly baseApiUrl = 'http://localhost:3000'

  public login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseApiUrl}/api/auth/signin`, credentials);
  }

  public refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseApiUrl}/auth/refresh`, {});
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/auth/logout`, {});
  }
}
