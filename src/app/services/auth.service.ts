import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
  email: string;
  joined: string; // ISO date string
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {
    // Load from localStorage on init
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
  }

  login(email: string, password: string): boolean {
    // Fake success
    if (email && password) {
      const user: User = {
        name: email.split('@')[0], // fake name from email
        email,
        joined: new Date().toISOString(),
        role: email.includes('admin') ? 'admin' : 'user'  // ← fake: use 'admin@email.com' for admin
      };
      localStorage.setItem('token', 'fake-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser = user;
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    // Fake register
    const user: User = {
      name,
      email,
      joined: new Date().toISOString(),
      role: email.includes('admin') ? 'admin' : 'user'
    };
    localStorage.setItem('token', 'fake-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser = user;
    return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}