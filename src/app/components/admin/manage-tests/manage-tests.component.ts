import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestService } from '@services/test.service';
import { PracticeTest } from '@models/test.models';

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
  templateUrl: './manage-tests.component.html',
  styleUrls: ['./manage-tests.component.scss']
})
export class ManageTestsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  tests: PracticeTest[] = [];
  displayedColumns = ['title', 'certificate', 'difficulty', 'actions'];

  // Form for ADDING new test
  addForm = this.fb.group({
    title: ['', Validators.required],
    certificate: ['', Validators.required],
    difficulty: ['', Validators.required]
  });

  // Form for EDITING existing test
  editForm = this.fb.group({
    title: ['', Validators.required],
    certificate: ['', Validators.required],
    difficulty: ['', Validators.required]
  });

  // Currently edited test (null when not editing)
  editingTest: PracticeTest | null = null;

  private testService = inject(TestService);
  

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.testService.getTests().subscribe(tests => {
      this.tests = tests;
    });
  }

  // ── ADD NEW TEST ───────────────────────────────────────
  addTest() {
    if (this.addForm.valid) {
      const value = this.addForm.value;
      console.log(value);
      const newTest: PracticeTest = {
        id: 'test-' + Date.now(),
        title: value.title!,
        certificate: value.certificate!,
        description: 'New description (edit later)',
        questionsCount: 0,
        durationMinutes: 60,
        difficulty: value.difficulty as 'Easy' | 'Medium' | 'Hard',
        tags: [],
        timeLimitMinutes: 60,
        questions: []
      };

      // Temporary: add to mock array in service
      (this.testService as any).mockTests.push(newTest); // hack for demo
      this.loadTests();

      this.addForm.reset();
    }
  }

  // ── START EDITING ──────────────────────────────────────
  startEdit(test: PracticeTest) {
    this.editingTest = test;

    // Fill edit form with current values
    this.editForm.patchValue({
      title: test.title,
      certificate: test.certificate,
      difficulty: test.difficulty
    });
  }

  // ── SAVE EDIT ──────────────────────────────────────────
  saveEdit() {
    if (this.editForm.valid && this.editingTest) {
      const value = this.editForm.value;

      // Update the existing test object
      this.editingTest.title = value.title!;
      this.editingTest.certificate = value.certificate!;
      this.editingTest.difficulty = value.difficulty as 'Easy' | 'Medium' | 'Hard';

      // Temporary: since we're using mock array, changes are already reflected
      this.loadTests(); // refresh view

      // Exit edit mode
      this.cancelEdit();
    }
  }

  // ── CANCEL EDIT ────────────────────────────────────────
  cancelEdit() {
    this.editingTest = null;
    this.editForm.reset();
  }

  // Delete (simple for now)
  deleteTest(id: string) {
    if (confirm('Delete this test permanently?')) {
      (this.testService as any).mockTests = (this.testService as any).mockTests.filter(
        (t: PracticeTest) => t.id !== id
      );
      this.loadTests();
    }
  }

  manageQuestions(testId: string) {
    this.router.navigate(['/admin/questions', testId]);
  }
}