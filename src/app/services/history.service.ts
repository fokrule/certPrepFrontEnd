import { Injectable, inject } from '@angular/core';
import { PracticeTest } from '../models/test.models';

export interface TestAttempt {
  testId: string;
  testTitle: string;
  score: number;
  correctCount: number;
  total: number;
  passed: boolean;
  date: string; // ISO date
  details?: any[]; // optional - full breakdown
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private storageKey = 'cert_prep_history';

  private getAttempts(): TestAttempt[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveAttempts(attempts: TestAttempt[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(attempts));
  }

  addAttempt(result: any) { // result from submitAnswers
    const attempts = this.getAttempts();

    const newAttempt: TestAttempt = {
      testId: result.testId,
      testTitle: result.testTitle,
      score: result.score,
      correctCount: result.correctCount,
      total: result.total,
      passed: result.passed,
      date: new Date().toISOString(),
      details: result.details // optional
    };

    attempts.push(newAttempt);
    this.saveAttempts(attempts);
  }

  getHistory(): TestAttempt[] {
    return this.getAttempts().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getStats() {
    const attempts = this.getAttempts();
    if (attempts.length === 0) return { total: 0, avgScore: 0, passRate: 0 };

    const total = attempts.length;
    const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / total;
    const passes = attempts.filter(a => a.passed).length;
    const passRate = (passes / total) * 100;

    return { total, avgScore: Math.round(avgScore), passRate: Math.round(passRate) };
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }
}