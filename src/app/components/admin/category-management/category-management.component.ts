import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TestService } from '@services/test.service';
import { Category } from '@models/test.models';

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
    MatIconModule
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  private fb = inject(FormBuilder);
  displayedColumns = ['name', 'description', 'actions'];

  editingCategory: Category | null = null;

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  private testService = inject(TestService);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.testService.getCategories().subscribe(cats => this.categories = cats);
  }

  addOrUpdateCategory() {
    if (this.categoryForm.valid) {
      const value = this.categoryForm.value;

      const catData: Omit<Category, 'id'> = {
        name: value.name!,
        description: value.description || '',
        isActive: true
      };

      if (this.editingCategory) {
        const updated = { ...this.editingCategory, ...catData };
        this.testService.updateCategory(updated).subscribe(() => {
          this.loadCategories();
          this.cancelEdit();
        });
      } else {
        this.testService.addCategory(catData).subscribe(() => {
          this.loadCategories();
          this.categoryForm.reset();
        });
      }
    }
  }

  startEdit(cat: Category) {
    this.editingCategory = cat;
    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description
    });
  }

  cancelEdit() {
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  deleteCategory(id: string) {
    if (confirm('Delete this category? Questions will lose category association.')) {
      this.testService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }
}