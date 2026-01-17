import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TestService } from '@services/test.service';
import { PracticeTest } from '@models/test.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-tests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <h2>Manage Tests</h2>

    <form [formGroup]="testForm" (ngSubmit)="addTest()" class="add-form">
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Certificate</mat-label>
        <input matInput formControlName="certificate" required>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Difficulty</mat-label>
        <mat-select formControlName="difficulty" required>
          <mat-option value="Easy">Easy</mat-option>
          <mat-option value="Medium">Medium</mat-option>
          <mat-option value="Hard">Hard</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="testForm.invalid">Add Test</button>
    </form>

    <table mat-table [dataSource]="tests" class="test-table">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let test">{{ test.title }}</td>
      </ng-container>

      <ng-container matColumnDef="certificate">
        <th mat-header-cell *matHeaderCellDef>Certificate</th>
        <td mat-cell *matCellDef="let test">{{ test.certificate }}</td>
      </ng-container>

      <ng-container matColumnDef="difficulty">
        <th mat-header-cell *matHeaderCellDef>Difficulty</th>
        <td mat-cell *matCellDef="let test">{{ test.difficulty }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let test">
          <button mat-icon-button (click)="editTest(test)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button (click)="deleteTest(test.id)"><mat-icon>delete</mat-icon></button>
          <button mat-icon-button (click)="manageQuestions(test.id)"><mat-icon>question_answer</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`.add-form { display: flex; gap: 16px; margin-bottom: 32px; } .test-table { width: 100%; }`]
})
export class ManageTestsComponent implements OnInit {
  tests: PracticeTest[] = [];
  displayedColumns = ['title', 'certificate', 'difficulty', 'actions'];

  private fb = inject(FormBuilder);
  
  testForm = this.fb.group({
    title: ['', Validators.required],
    certificate: ['', Validators.required],
    difficulty: ['', Validators.required]
  });

  private testService = inject(TestService);
 
  private router = inject(Router);

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.testService.getTests().subscribe(tests => this.tests = tests);
  }

  addTest() {
    if (this.testForm.valid) {
      // In real app: this.testService.createTest(this.testForm.value).subscribe(...)
      console.log('Added test:', this.testForm.value);
      this.loadTests();
      this.testForm.reset();
    }
  }

  editTest(test: PracticeTest) {
    // Implement form for edit
    console.log('Edit test:', test);
  }

  deleteTest(id: string) {
    // In real: this.testService.deleteTest(id).subscribe(...)
    console.log('Deleted test:', id);
    this.loadTests();
  }

  manageQuestions(testId: string) {
    this.router.navigate(['/admin/questions', testId]);
  }
}