import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PracticeTest, Question, Answer } from '@models/test.models';  //

@Injectable({
  providedIn: 'root'
})
export class TestService {

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
        correctAnswerId: 'b'
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
        correctAnswerId: 'b'
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
        correctAnswerId: 'b'
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
}