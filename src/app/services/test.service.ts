import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PracticeTest, Question, Answer, TestTemplate, Category } from '@models/test.models';  

@Injectable({
  providedIn: 'root'
})
export class TestService {

  // Global test templates (rules only)
private mockTestTemplates: TestTemplate[] = [
  {
    id: 'temp-aws-dev',
    title: 'AWS Developer Associate Practice',
    certificate: 'AWS Certified Developer - Associate',
    description: 'Full practice set for certification',
    durationMinutes: 130,
    totalQuestions: 65,
    difficulty: 'Medium',
    isPremium: false,
    categories: ['AWS Lambda', 'IAM', 'DynamoDB', 'S3'],
    passThreshold: 70,
    createdAt: new Date().toISOString()
  }
  // Add more later...
];

// ── TEST TEMPLATE METHODS ────────────────────────────────────────
getTestTemplates(): Observable<TestTemplate[]> {
  return of(this.mockTestTemplates);
}

addTestTemplate(template: Omit<TestTemplate, 'id'>): Observable<TestTemplate> {
  const newTemplate: TestTemplate = {
    ...template,
    id: 'temp-' + Date.now()
  };
  this.mockTestTemplates.push(newTemplate);
  return of(newTemplate);
}

updateTestTemplate(updated: TestTemplate): Observable<TestTemplate> {
  const index = this.mockTestTemplates.findIndex(t => t.id === updated.id);
  if (index !== -1) {
    this.mockTestTemplates[index] = updated;
  }
  return of(updated);
}

deleteTestTemplate(id: string): Observable<void> {
  this.mockTestTemplates = this.mockTestTemplates.filter(t => t.id !== id);
  return of(void 0);
}

// Global categories
private mockCategories: Category[] = [
  { id: 'cat-aws-lambda', name: 'AWS Lambda', isActive: true },
  { id: 'cat-iam', name: 'IAM', isActive: true },
  { id: 'cat-vpc', name: 'VPC & Networking', isActive: true },
  // Add more...
];

// ── CATEGORY METHODS ─────────────────────────────────────────────
getCategories(): Observable<Category[]> {
  return of(this.mockCategories.filter(c => c.isActive));
}

addCategory(category: Omit<Category, 'id'>): Observable<Category> {
  const newCat: Category = {
    ...category,
    id: 'cat-' + Date.now(),
    isActive: true
  };
  this.mockCategories.push(newCat);
  return of(newCat);
}

updateCategory(updated: Category): Observable<Category> {
  const index = this.mockCategories.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    this.mockCategories[index] = updated;
  }
  return of(updated);
}

deleteCategory(id: string): Observable<void> {
  this.mockCategories = this.mockCategories.filter(c => c.id !== id);
  return of(void 0);
}
  private mockQuestions: Question[] = [
    {
      id: 'q1',
      text: 'What is AWS Lambda?',
      options: [
        { id: 'a', text: 'Serverless compute service' },
        { id: 'b', text: 'Virtual server' },
        { id: 'c', text: 'Object storage' },
        { id: 'd', text: 'Database' }
      ],
      correctAnswerId: 'a',
      categoryId: 'AWS Lambda',
      difficulty: 'Medium',
      isPremium: false,
      tags: ['serverless', 'compute']
    },
    // Add 5–10 more mock questions here for testing...
  ];

  // ── QUESTION BANK METHODS ────────────────────────────────────────
  getQuestions(): Observable<Question[]> {
    return of(this.mockQuestions);
  }

  getQuestionsByCategory(category: string): Observable<Question[]> {
    return of(this.mockQuestions.filter(q => q.categoryId === category));
  }

  addQuestion(question: Omit<Question, 'id'>): Observable<Question> {
    const newQ: Question = {
      ...question,
      id: 'q-' + Date.now()
    };
    this.mockQuestions.push(newQ);
    return of(newQ);
  }

  updateQuestion(updated: Question): Observable<Question> {
    const index = this.mockQuestions.findIndex(q => q.id === updated.id);
    if (index !== -1) {
      this.mockQuestions[index] = updated;
    }
    return of(updated);
  }

  deleteQuestion(id: string): Observable<void> {
    this.mockQuestions = this.mockQuestions.filter(q => q.id !== id);
    return of(void 0);
  }

  private mockTests: PracticeTest[] = [
  {
    id: 'aws-dev-associate',
    title: 'AWS Certified Developer - Associate Practice Test 2025',
    certificate: 'AWS Certified Developer - Associate',
    description: 'Full-length practice exam covering Lambda, API Gateway, DynamoDB, S3 and more',
    questionsCount: 3,           // ← changed to match demo
    durationMinutes: 10,         // ← short for demo
    difficulty: 'Medium',
    tags: ['AWS', 'Cloud', 'Developer'],
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q1',
        text: 'What is the serverless compute service in AWS?',
        options: [
          { id: 'a', text: 'EC2' },
          { id: 'b', text: 'Lambda' },
          { id: 'c', text: 'S3' },
          { id: 'd', text: 'RDS' }
        ],
        correctAnswerId: 'b',
        categoryId: 'AWS Lambda',          // ← ADD THIS
        difficulty: 'Medium',            // ← ADD THIS
        isPremium: false
      },
      {
        id: 'q2',
        text: 'Which service provides object storage?',
        options: [
          { id: 'a', text: 'EBS' },
          { id: 'b', text: 'S3' },
          { id: 'c', text: 'EFS' },
          { id: 'd', text: 'Glacier' }
        ],
        correctAnswerId: 'b',
        categoryId: 'IAM',
        difficulty: 'Easy',
        isPremium: false
      },
      {
        id: 'q3',
        text: 'What is used for message queuing?',
        options: [
          { id: 'a', text: 'SNS' },
          { id: 'b', text: 'SQS' },
          { id: 'c', text: 'SES' },
          { id: 'd', text: 'Step Functions' }
        ],
        correctAnswerId: 'b',
        categoryId: 'IAM',
        difficulty: 'Easy',
        isPremium: false
      }
    ]
  },
  {
    id: 'security-plus',
    title: 'CompTIA Security+ SY0-701 Full Practice Exam',
    certificate: 'CompTIA Security+',
    description: 'Comprehensive coverage of threats, vulnerabilities, architecture, operations & more',
    questionsCount: 90,
    durationMinutes: 90,
    difficulty: 'Medium',
    tags: ['Cybersecurity', 'CompTIA'],
    // For these tests you can leave questions empty for now
    timeLimitMinutes: 90,
    questions: []
  },
  {
    id: 'google-cloud-architect',
    title: 'Google Professional Cloud Architect - Practice Tests',
    certificate: 'Google Professional Cloud Architect',
    description: 'Realistic questions on designing, developing & managing secure GCP solutions',
    questionsCount: 50,
    durationMinutes: 120,
    difficulty: 'Hard',
    tags: ['GCP', 'Cloud Architecture'],
    timeLimitMinutes: 120,
    questions: []
  },
  {
    id: 'az-104',
    title: 'Microsoft Azure Administrator AZ-104 Practice Exam',
    certificate: 'Microsoft Azure Administrator',
    description: 'Manage Azure identities, storage, compute, networking & monitoring',
    questionsCount: 60,
    durationMinutes: 120,
    difficulty: 'Medium',
    tags: ['Azure', 'Microsoft'],
    timeLimitMinutes: 120,
    questions: []
  },
  {
    id: 'cka',
    title: 'Certified Kubernetes Administrator (CKA) Practice Tests',
    certificate: 'Certified Kubernetes Administrator',
    description: 'Hands-on style questions for cluster architecture, installation & configuration',
    questionsCount: 40,
    durationMinutes: 180,
    difficulty: 'Hard',
    tags: ['Kubernetes', 'DevOps'],
    timeLimitMinutes: 180,
    questions: []
  }
];

  getTests(searchTerm: string = ''): Observable<PracticeTest[]> {
    if (!searchTerm.trim()) {
      return of(this.mockTests);
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = this.mockTests.filter(test =>
      test.title.toLowerCase().includes(term) ||
      test.certificate.toLowerCase().includes(term) ||
      test.tags.some(tag => tag.toLowerCase().includes(term))
    );

    return of(filtered);
  }

  getTestById(id: string): Observable<PracticeTest | undefined> {
    return of(this.mockTests.find(t => t.id === id));
  }

  submitAnswers(testId: string, answers: Answer[]): Observable<any> {
    return this.getTestById(testId).pipe(
      map(test => {
        if (!test) throw new Error('Test not found');

        let correctCount = 0;
        const results: any[] = [];

        test.questions.forEach((q, index) => {
          const userAnswer = answers.find(a => a.questionId === q.id)?.selectedOptionId;
          const isCorrect = userAnswer === q.correctAnswerId;

          if (isCorrect) correctCount++;

          results.push({
            questionId: q.id,
            text: q.text,
            selected: q.options.find(o => o.id === userAnswer)?.text || 'Not answered',
            correct: q.options.find(o => o.id === q.correctAnswerId)?.text,
            isCorrect
          });
        });

        const score = Math.round((correctCount / test.questions.length) * 100);

        return {
          score,
          correctCount,
          total: test.questions.length,
          passed: score >= 70,
          details: results,
          testTitle: test.title,
          testId
        };
      })
    );
  }

  addTest(newTest: PracticeTest) {
    this.mockTests.push(newTest);
  }
}