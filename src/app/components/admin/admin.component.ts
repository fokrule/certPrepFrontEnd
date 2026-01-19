// admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <mat-drawer-container class="admin-container">
      <mat-drawer mode="side" opened class="sidebar">
        <div class="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/tests" routerLinkActive="active">
            <mat-icon>quiz</mat-icon>
            Manage Tests
          </a>
          <a mat-list-item routerLink="/admin/questions-bank">
            <mat-icon>library_books</mat-icon>
            Question Bank
          </a>
          <a mat-list-item routerLink="/admin/test-templates" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            Test Templates
          </a>
        </mat-nav-list>
      </mat-drawer>

      <mat-drawer-content class="content">
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    .admin-container { height: calc(100vh - 64px); }
    .sidebar { width: 280px; background: #f8f9fa; border-right: 1px solid #ddd; }
    .sidebar-header { padding: 20px; border-bottom: 1px solid #ddd; }
    .content { padding: 24px; }
    a.active { background-color: #e3f2fd; color: #1976d2; }
    a.disabled { color: #aaa; pointer-events: none; }
  `]
})
export class AdminComponent {
  selectedTestId?: string; // you can update this from manage-tests if needed
}