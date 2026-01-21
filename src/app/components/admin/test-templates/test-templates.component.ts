import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { TestService } from '@services/test.service';
import { TestTemplate, Question, Category } from '@models/test.models';

@Component({
  selector: 'app-test-templates',
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
    MatChipsModule
  ],
  templateUrl: './test-templates.component.html',
  styleUrls: ['./test-templates.component.scss']
})
export class TestTemplatesComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  templates: TestTemplate[] = [];
  availableCategories: Category[] = [];
  displayedColumns = ['title', 'certificate', 'totalQuestions', 'duration', 'actions'];

  editingTemplate: TestTemplate | null = null;

  templateForm = this.fb.group({
    title: ['', Validators.required],
    certificate: ['', Validators.required],
    description: [''],
    durationMinutes: [90, [Validators.required, Validators.min(30)]],
    totalQuestions: [50, [Validators.required, Validators.min(10)]],
    difficulty: ['Medium', Validators.required],
    isPremium: [false],
    passThreshold: [70, [Validators.required, Validators.min(50), Validators.max(100)]],
    categories: [[] as string[], Validators.required]
  });

  private testService = inject(TestService);

  ngOnInit() {
    this.loadTemplates();
    this.loadCategories();
  }

  loadTemplates() {
  this.testService.getTestTemplates().subscribe(templates => {
    this.templates = templates;
    this.templates = [...this.templates];  
  });
}

  loadCategories() {
  this.testService.getCategories().subscribe(cats => {
    this.availableCategories = cats;
  });
}
  addOrUpdateTemplate() {
    if (this.templateForm.valid) {
      const value = this.templateForm.value;

      const templateData: Omit<TestTemplate, 'id'> = {
        title: value.title!,
        certificate: value.certificate!,
        description: value.description || '',
        durationMinutes: value.durationMinutes!,
        totalQuestions: value.totalQuestions!,
        difficulty: value.difficulty as any,
        isPremium: !!value.isPremium,
        categories: value.categories || [],
        passThreshold: value.passThreshold!
      };

      if (this.editingTemplate) {
        const updated = { ...this.editingTemplate, ...templateData };
        this.testService.updateTestTemplate(updated).subscribe(() => {
          this.loadTemplates();
          this.cancelEdit();
        });
      } else {
        this.testService.addTestTemplate(templateData).subscribe(() => {
          this.loadTemplates();
          this.templates = [...this.templates];
          this.templateForm.reset();
        });
      }
    }
  }

  startEdit(template: TestTemplate) {
    this.editingTemplate = template;
    this.templateForm.patchValue({
      title: template.title,
      certificate: template.certificate,
      description: template.description,
      durationMinutes: template.durationMinutes,
      totalQuestions: template.totalQuestions,
      difficulty: template.difficulty,
      isPremium: template.isPremium,
      passThreshold: template.passThreshold,
      categories: template.categories || []
    });
  }

  cancelEdit() {
    this.editingTemplate = null;
    this.templateForm.reset();
  }

  deleteTemplate(id: string) {
    if (confirm('Delete this test template permanently?')) {
      this.testService.deleteTestTemplate(id).subscribe(() => this.loadTemplates());
      this.loadTemplates();
      this.templates = [...this.templates];
    }
  }

  // Add this method in the class
  getCategoryName(catId: string): string {
    const cat = this.availableCategories.find(c => c.id === catId);
    return cat ? cat.name : catId;  // fallback to ID if not found
  }
}