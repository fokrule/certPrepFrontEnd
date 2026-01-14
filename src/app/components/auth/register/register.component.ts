import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join thousands practicing certifications</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput [(ngModel)]="credentials.name" name="name" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="credentials.email" name="email" type="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [(ngModel)]="credentials.password" name="password" type="password" required>
            </mat-form-field>

            @if (errorMessage) {
              <div class="error">{{ errorMessage }}</div>
            }

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="registerForm.invalid || isLoading"
                    class="full-width submit-btn">
              @if (!isLoading) { Create Account }
              @if (isLoading) {
                <mat-spinner diameter="24"></mat-spinner>
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [` /* same styles as login - you can extract to shared css later */ `]
})
export class RegisterComponent {
  credentials = { name: '', email: '', password: '' };
  errorMessage: string | null = null;
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tests']);
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;

    setTimeout(() => {
      const success = this.authService.register(
        this.credentials.name,
        this.credentials.email,
        this.credentials.password
      );
      this.isLoading = false;

      if (success) {
        this.router.navigate(['/tests']);
      } else {
        this.errorMessage = 'Registration failed. Try different email.';
      }
    }, 800);
  }
}