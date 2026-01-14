import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';

interface ResultDetail {
  questionId: string;
  text: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss']
})
export class TestResultComponent implements OnInit {
  result: any = null;
  testId?: string;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id') || undefined;

    // Get result from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.result = history.state?.result;

    // Fallback: if no state (e.g. direct access), redirect
    if (!this.result) {
      this.router.navigate(['/tests']);
    }
  }

  get scoreColor(): string {
    if (!this.result) return '';
    return this.result.score >= 70 ? 'success' : 'fail';
  }

  retakeTest() {
    if (this.testId) {
      this.router.navigate(['/test', this.testId]);
    }
  }

  backToTests() {
    this.router.navigate(['/tests']);
  }
}