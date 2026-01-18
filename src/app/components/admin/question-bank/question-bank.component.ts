import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TestService } from '@services/test.service';
import { Question } from '@models/test.models';

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
    MatIconModule
  ],
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss']
})
export class QuestionBankComponent implements OnInit {
  private fb = inject(FormBuilder);
  questions: Question[] = [];
  displayedColumns = ['text', 'category', 'difficulty', 'premium', 'actions'];

  editingQuestion: Question | null = null;

  questionForm = this.fb.group({
    text: ['', Validators.required],
    category: ['', Validators.required],           // NEW
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
    this.loadQuestions();
  }

  loadQuestions() {
    this.testService.getQuestions().subscribe(qs => this.questions = qs);
  }

  addOrUpdateQuestion() {
    if (this.questionForm.valid) {
      const value = this.questionForm.value;

      const options = [
        { id: 'a', text: value.optionA || '' },
        { id: 'b', text: value.optionB || '' },
        { id: 'c', text: value.optionC || '' },
        { id: 'd', text: value.optionD || '' }
      ];

      const questionData: Omit<Question, 'id'> = {
        text: value.text!,
        options,
        correctAnswerId: value.correctAnswer!,
        category: value.category!,                   
        difficulty: value.difficulty as 'Easy' | 'Medium' | 'Hard',  
        isPremium: !!value.isPremium                 
      };

      if (this.editingQuestion) {
        // Update existing
        const updated = { ...this.editingQuestion, ...questionData };
        this.testService.updateQuestion(updated).subscribe(() => {
          this.loadQuestions();
          this.cancelEdit();
        });
      } else {
        // Add new
        this.testService.addQuestion(questionData).subscribe(() => {
          this.loadQuestions();
          this.questionForm.reset();
        });
      }
    }
  }

  startEdit(q: Question) {
    this.editingQuestion = q;
    this.questionForm.patchValue({
      text: q.text,
      category: q.category,                       // NEW
      difficulty: q.difficulty,                   // NEW
      isPremium: q.isPremium,                     // NEW
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
    }
  }
}