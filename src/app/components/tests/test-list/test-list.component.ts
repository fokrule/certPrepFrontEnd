import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TestService } from '@services/test.service';
import { PracticeTest } from '@models/test.models';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  tests: PracticeTest[] = [];
  searchTerm = '';

  private testService = inject(TestService);

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.testService.getTests(this.searchTerm).subscribe(tests => {
      this.tests = tests;
    });
  }

  onSearch() {
    this.loadTests();
  }
}