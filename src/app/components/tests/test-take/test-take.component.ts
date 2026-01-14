import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // ← ADD THIS IMPORT
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription, takeWhile } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestService } from '../../../services/test.service';
import { PracticeTest, Question, Answer } from '@models/test.models';

@Component({
  selector: 'app-test-take',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,  
  ],
  templateUrl: './test-take.component.html',
  styleUrls: ['./test-take.component.scss']
})


export class TestTakeComponent implements OnInit, OnDestroy {
  test?: PracticeTest;
  currentQuestionIndex = 0;
  answers: Answer[] = [];
  timeLeftSeconds = 0;
  timerSubscription?: Subscription;
  isSubmitting = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private testService = inject(TestService);

  get currentQuestion(): Question | undefined {
    return this.test?.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    return this.test ? (this.currentQuestionIndex + 1) / this.test.questions.length * 100 : 0;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/tests']);
      return;
    }

    this.testService.getTestById(id).subscribe(test => {
      if (!test) {
        this.router.navigate(['/tests']);
        return;
      }
      this.test = test;
      this.timeLeftSeconds = test.timeLimitMinutes * 60;
      // Initialize answers
      this.answers = test.questions.map(q => ({ questionId: q.id, selectedOptionId: null }));
      this.startTimer();
    });
  }

  startTimer() {
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timeLeftSeconds > 0),
      map(() => this.timeLeftSeconds--)
    ).subscribe({
      next: () => { /* update UI via binding */ },
      complete: () => this.onTimeUp()
    });
  }

  formatTime(): string {
    const minutes = Math.floor(this.timeLeftSeconds / 60);
    const seconds = this.timeLeftSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  previous() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  next() {
    if (this.currentQuestionIndex < (this.test?.questions.length ?? 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  selectOption(questionId: string, optionId: string) {
    const answer = this.answers.find(a => a.questionId === questionId);
    if (answer) {
      answer.selectedOptionId = optionId;
    }
  }

  onTimeUp() {
    alert('Time is up! Submitting your test...');
    this.submitTest();
  }

  submitTest() {
    if (this.isSubmitting || !this.test) return;
    this.isSubmitting = true;

    this.testService.submitAnswers(this.test.id, this.answers).subscribe({
      next: (result) => {
        // Navigate with result data (simple way: use query params or state)
        this.router.navigate(['/result', this.test?.id], {
          state: { result }  // ← pass result via navigation state
        });
      },
      error: (err) => {
        console.error(err);
        alert('Error submitting test');
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }
}