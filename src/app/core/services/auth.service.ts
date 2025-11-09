import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthResponse, AuthState, LoginRequest, User } from '../../feature/auth/models/auth.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);

  // Signals for reactive state management
  private readonly user = signal<User | null>(null);
  private readonly token = signal<string | null>(null);
  private readonly isLoading = signal<boolean>(false);

  // Computed signals
  public readonly isAuthenticated = computed(() => !!this.token() && !!this.user());
  public readonly authState = computed<AuthState>(() => ({
    user: this.user(),
    token: this.token(),
    isAuthenticated: this.isAuthenticated(),
    isLoading: this.isLoading()
  }));

  constructor() {
    this.initializeAuthFromStorage();
  }

  private initializeAuthFromStorage(): void {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_KEY);

    if (storedToken && storedUser) {
      try {
        this.token.set(storedToken);
        this.user.set(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStorage();
      }
    }
  }

  private setAuthData(authResponse: AuthResponse): void {
    this.token.set(authResponse.token);
    this.user.set(authResponse.user);
    
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  public login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);

    // Simulate API call - replace with actual API call
    return this.apiService.login(credentials).pipe(
      map(response => {
        this.setAuthData(response);
        this.isLoading.set(false);
        return response;
      })
    );
  }

  logout(): void {
    this.user.set(null);
    this.token.set(null);
    this.clearStorage();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.token();
  }

  getCurrentUser(): User | null {
    return this.user();
  }
}
