import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
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
          <mat-card-title>Welcome back</mat-card-title>
          <mat-card-subtitle>Sign in to continue practicing</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
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
                    [disabled]="loginForm.invalid || isLoading"
                    class="full-width submit-btn">
              @if (!isLoading) { Sign In }
              @if (isLoading) {
                <mat-spinner diameter="24"></mat-spinner>
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
    }
    .full-width {
      width: 100%;
      margin: 16px 0;
    }
    .submit-btn {
      margin-top: 16px;
    }
    .error {
      color: #f44336;
      margin: 8px 0;
      text-align: center;
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string | null = null;
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tests']);
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;

    // Small timeout just for visual feedback (remove in real app)
    setTimeout(() => {
      const success = this.authService.login(this.credentials.email, this.credentials.password);
      this.isLoading = false;

      if (success) {
        this.router.navigate(['/tests']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }, 800);
  }
}