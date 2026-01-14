import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { HistoryService, TestAttempt } from '../../services/history.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  history: TestAttempt[] = [];
  stats: { total: number; avgScore: number; passRate: number } = { total: 0, avgScore: 0, passRate: 0 };

  displayedColumns: string[] = ['date', 'testTitle', 'score', 'passed', 'action'];

  private authService = inject(AuthService);
  private historyService = inject(HistoryService);

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadHistory();
  }

  loadHistory() {
    this.history = this.historyService.getHistory();
    this.stats = this.historyService.getStats();
  }

  retake(testId: string) {
    // Navigate to test
    window.location.href = `/test/${testId}`; // or use router.navigate
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
      this.historyService.clearHistory();
      this.loadHistory();
    }
  }
}