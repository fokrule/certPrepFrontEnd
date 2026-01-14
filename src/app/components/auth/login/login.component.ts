import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-title>Login</mat-card-title>
        
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="email" type="email">
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput [(ngModel)]="password" type="password">
        </mat-form-field>
        
        <button mat-raised-button color="primary" (click)="login()" [disabled]="!email || !password">
          Login
        </button>
        
        <p>Don't have account? <a routerLink="/register">Register</a></p>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    mat-card {
      width: 100%;
      max-width: 400px;
    }
    mat-form-field {
      width: 100%;
      margin: 12px 0;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  
  private auth = inject(AuthService);
  private router = inject(Router);

  login() {
    if (this.auth.login(this.email, this.password)) {
      this.router.navigate(['/tests']);
    } else {
      alert('Login failed');
    }
  }
}