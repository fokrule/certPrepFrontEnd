import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fakeToken: string | null = null;

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Fake success - in real app use HTTP + real backend
    if (email && password) {
      this.fakeToken = 'fake-jwt-token-' + Date.now();
      localStorage.setItem('token', this.fakeToken);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
  // Fake success - later replace with real API call
  if (name && email && password) {
    // In real app you would send to backend
    this.fakeToken = 'fake-jwt-token-' + Date.now();
    localStorage.setItem('token', this.fakeToken);
    return true;
  }
  return false;
}

  logout(): void {
    this.fakeToken = null;
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}