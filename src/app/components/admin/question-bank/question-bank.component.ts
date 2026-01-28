import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { TestService } from '@services/test.service';
import { Question, Category, Option } from '@models/test.models';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss']
})
export class QuestionBankComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  questions: Question[] = [];
  availableCategories: Category[] = [];
  displayedColumns = ['text', 'category', 'difficulty', 'premium', 'actions'];
  isLoading = false;
  editingQuestion: Question | null = null;

  questionForm = this.fb.group({
    text: ['', Validators.required],
    categoryId: ['', Validators.required],
    difficulty: ['', Validators.required],         // NEW
    isPremium: [false],                            // NEW
    optionA: ['', Validators.required],
    optionB: ['', Validators.required],
    optionC: ['', Validators.required],
    optionD: ['', Validators.required],
    correctAnswer: ['', Validators.required]       // a/b/c/d
  });

  
  private testService = inject(TestService);

  ngOnInit() {
    this.loadCategories();
    this.loadQuestions();
  }

  loadCategories() {
    this.testService.getCategories().subscribe({
      next: cats => this.availableCategories = cats,
      error: () => this.snackBar.open('Failed to load categories', 'Close', { duration: 4000 })
    });
  }

  loadQuestions() {
    this.isLoading = true;
    this.testService.getQuestions().subscribe({
      next: (qs) => {
        this.questions = [...qs];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // optional: this.snackBar.open(...)
      }
    });
  }


  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return '—';
    return this.availableCategories.find(c => c.id === categoryId)?.name || '—';
  }
  addOrUpdateQuestion() {
  if (this.questionForm.invalid) return;

  const value = this.questionForm.value;

  const options: Option[] = [
    { id: 'a', text: value.optionA! },
    { id: 'b', text: value.optionB! },
    { id: 'c', text: value.optionC! },
    { id: 'd', text: value.optionD! }
  ];

  const questionData: Omit<Question, 'id'> = {
    text: value.text!,
    options,
    correctAnswerId: value.correctAnswer as 'a'|'b'|'c'|'d',
    categoryId: Number(value.categoryId),          // important: number
    difficulty: value.difficulty as 'Easy'|'Medium'|'Hard',
    isPremium: !!value.isPremium
  };

  this.isLoading = true;

  const action = this.editingQuestion
    ? this.testService.updateQuestion({ ...this.editingQuestion, ...questionData })
    : this.testService.addQuestion(questionData);

  action.subscribe({
    next: () => {
      this.loadQuestions();
      this.cancelEdit();
      this.questionForm.reset({ isPremium: false });
      this.isLoading = false;
      // optional snackbar success
    },
    error: () => {
      this.isLoading = false;
      // optional snackbar error
    }
  });
}

  // In startEdit – ensure categoryId is string or number matching mat-select
  startEdit(q: Question) {
    this.editingQuestion = q;
    this.questionForm.patchValue({
      text: q.text,
      categoryId: q.categoryId.toString(),           // mat-select compares with === so type must match
      difficulty: q.difficulty,
      isPremium: q.isPremium,
      optionA: q.options.find(o => o.id === 'a')?.text || '',
      optionB: q.options.find(o => o.id === 'b')?.text || '',
      optionC: q.options.find(o => o.id === 'c')?.text || '',
      optionD: q.options.find(o => o.id === 'd')?.text || '',
      correctAnswer: q.correctAnswerId
    });
  }

  cancelEdit() {
    this.editingQuestion = null;
    this.questionForm.reset();
  }

  deleteQuestion(id: string) {
    if (confirm('Delete this question permanently?')) {
      this.testService.deleteQuestion(id).subscribe(() => this.loadQuestions());
      this.loadQuestions();
      this.questions = [...this.questions];
    }
  }
}