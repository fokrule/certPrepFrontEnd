import { Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TestListComponent } from './components/tests/test-list/test-list.component';
import { TestTakeComponent } from './components/tests/test-take/test-take.component';
import { TestResultComponent } from './components/tests/test-result/test-result.component';
import { AdminComponent } from './components/admin/admin.component';
import { ManageTestsComponent } from './components/admin/manage-tests/manage-tests.component';
import { ManageQuestionsComponent } from './components/admin/manage-questions/manage-questions.component';
import { QuestionBankComponent } from './components/admin/question-bank/question-bank.component';
import { adminGuard } from './guards/admin.guard';

import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tests', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Public list of tests (can see without login)
  { path: 'tests', component: TestListComponent },
  
  // Protected routes - need to be logged in
  { path: 'test/:id', component: TestTakeComponent, canActivate: [authGuard] },
  { path: 'result/:id', component: TestResultComponent, canActivate: [authGuard] },
  
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  
  // admin route
  {
  path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'tests', pathMatch: 'full' },
      { path: 'tests', component: ManageTestsComponent },
      {
        path: 'questions-bank',
        component: QuestionBankComponent
      },
      { path: 'questions/:testId', component: ManageQuestionsComponent }
    ]
  },
  // Fallback
  { path: '**', redirectTo: '/tests' }
];