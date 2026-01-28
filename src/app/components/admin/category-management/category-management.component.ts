import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';  // for @Inject

import { TestService } from '@services/test.service';
import { Category } from '@models/test.models';

// ── Confirmation Dialog ────────────────────────────────────────────────
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>
      Are you sure you want to delete "{{ data.name }}"?
      <br>
      This cannot be undone.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)">Delete</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogModule]
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {}
}

// ── Add/Edit Dialog ────────────────────────────────────────────────────
@Component({
  selector: 'app-category-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Category' : 'Add New Category' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="name" required autofocus>
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option [value]="1">Active</mat-option>
            <mat-option [value]="0">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">
        {{ data.isEdit ? 'Update' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatButtonModule,MatSelectModule]
})
export class CategoryDialog {
  form = inject(FormBuilder).group({
    name: [this.data.category?.name || '', Validators.required],
    status: [1, Validators.required]
  });

  constructor(
  public dialogRef: MatDialogRef<CategoryDialog>,
  @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; category: Category | null }
) {
  // Set initial values after constructor
  this.form.patchValue({
    name: this.data.category?.name || '',
    status: this.data.category ? Number(this.data.category.status) : 1
  });
}

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────
@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private testService = inject(TestService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  categories: Category[] = [];
  displayedColumns = ['name', 'status', 'actions'];

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
  console.log('loadCategories() called');

  this.isLoading = true;
  this.errorMessage = null;

  this.testService.getCategories().subscribe({
    next: (cats) => {
      console.log('Categories received:', cats);
      console.log('Count:', cats?.length);

      this.categories = [...cats];
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Subscription error:', err);

      this.isLoading = false;
      this.errorMessage = 'Failed to load categories';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
    },
    complete: () => {
      console.log('Subscription completed');
    }
  });
}


  openAddDialog() {
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '500px',
      data: { isEdit: false, category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.testService.addCategory(result).subscribe({
          next: () => {
            this.loadCategories();
            this.snackBar.open('Category added', 'Close', { duration: 3000 });
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Failed to add category', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '500px',
      data: { isEdit: true, category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.testService.updateCategory({ ...category, ...result }).subscribe({
          next: () => {
            this.loadCategories();
            this.snackBar.open('Category updated', 'Close', { duration: 3000 });
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Failed to update category', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  deleteCategory(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        this.testService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
            this.snackBar.open('Category deleted', 'Close', { duration: 3000 });
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Failed to delete category', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}