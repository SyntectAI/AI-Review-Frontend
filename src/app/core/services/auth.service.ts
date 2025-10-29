import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthResponse, AuthState, LoginRequest, RegisterRequest, User } from '../../feature/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly router = inject(Router);

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

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);

    // Simulate API call - replace with actual API call
    return this.mockLoginApi(credentials).pipe(
      delay(1000), // Simulate network delay
      map(response => {
        this.setAuthData(response);
        this.isLoading.set(false);
        return response;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);

    // Simulate API call - replace with actual API call
    return this.mockRegisterApi(data).pipe(
      delay(1000), // Simulate network delay
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

  private mockLoginApi(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock authentication - replace with real API call
    if (credentials.login === 'demo@example.com' && credentials.password === 'password') {
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: 'demo@example.com',
          login: credentials.login
        }
      };
      return of(mockResponse);
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  private mockRegisterApi(data: RegisterRequest): Observable<AuthResponse> {
    // Mock registration - replace with real API call
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '2',
        email: data.email,
        login: data.login
      }
    };
    return of(mockResponse);
  }
}
