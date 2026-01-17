import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterOutlet],
  template: `
    <h1>Admin Dashboard</h1>
    <mat-tab-group>
      <mat-tab label="Manage Tests">
        <router-outlet name="tests"></router-outlet>
      </mat-tab>
      <mat-tab label="Manage Questions">
        <router-outlet name="questions"></router-outlet>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`h1 { text-align: center; margin: 20px 0; }`]
})
export class AdminComponent { }