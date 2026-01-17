import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '@services/test.service';
import { PracticeTest, Question } from '@models/test.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-questions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <h2>Manage Questions for {{ test?.title }}</h2>

    <form [formGroup]="questionForm" (ngSubmit)="addQuestion()" class="add-form">
      <mat-form-field>
        <mat-label>Question Text</mat-label>
        <input matInput formControlName="text" required>
      </mat-form-field>

      <div formArrayName="options">
        @for (opt of options.controls; track $index) {
          <mat-form-field>
            <mat-label>Option {{ $index + 1 }}</mat-label>
            <input matInput [formControlName]="$index" required>
          </mat-form-field>
        }
      </div>

      <mat-form-field>
        <mat-label>Correct Option ID (a/b/c/d)</mat-label>
        <input matInput formControlName="correctAnswerId" required>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="questionForm.invalid">Add Question</button>
    </form>

    <table mat-table [dataSource]="test?.questions ?? []" class="question-table">
      <ng-container matColumnDef="text">
        <th mat-header-cell *matHeaderCellDef>Text</th>
        <td mat-cell *matCellDef="let q">{{ q.text }}</td>
      </ng-container>

      <ng-container matColumnDef="correct">
        <th mat-header-cell *matHeaderCellDef>Correct</th>
        <td mat-cell *matCellDef="let q">{{ q.correctAnswerId }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let q">
          <button mat-icon-button (click)="editQuestion(q)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button (click)="deleteQuestion(q.id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`.add-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; } .question-table { width: 100%; }`]
})
export class ManageQuestionsComponent implements OnInit {
  test: PracticeTest | null = null;
  displayedColumns = ['text', 'correct', 'actions'];

  private fb = inject(FormBuilder);
  questionForm = this.fb.group({
    text: ['', Validators.required],
    options: this.fb.array([this.fb.control('', Validators.required), this.fb.control('', Validators.required), this.fb.control('', Validators.required), this.fb.control('', Validators.required)]),
    correctAnswerId: ['', Validators.required]
  });

  get options() { return this.questionForm.get('options') as FormArray; }

  private testService = inject(TestService);
  
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const testId = this.route.snapshot.paramMap.get('testId');
    if (testId) {
      this.testService.getTestById(testId).subscribe(test => this.test = test || null);
    }
  }

  addQuestion() {
    if (this.questionForm.valid && this.test) {
      const value = this.questionForm.value;
      const newQuestion: Question = {
        id: 'q' + Date.now(), // fake ID
        text: value.text!,
        options: (value.options ?? []).map((text: string | null, i: number) => ({
          id: String.fromCharCode(97 + i),
          text: text ?? ''  // fallback if somehow null
        })),
        correctAnswerId: value.correctAnswerId!
      };
      // In real: this.testService.addQuestion(this.test.id, newQuestion).subscribe(...)
      console.log('Added question:', newQuestion);
      this.test.questions.push(newQuestion);
      this.questionForm.reset();
    }
  }

  editQuestion(q: Question) {
    // Implement form population for edit
    console.log('Edit question:', q);
  }

  deleteQuestion(id: string) {
    if (this.test) {
      this.test.questions = this.test.questions.filter(q => q.id !== id);
      // In real: this.testService.deleteQuestion(this.test.id, id).subscribe(...)
    }
  }
}