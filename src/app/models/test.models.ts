

export interface PracticeTest {
  id: string;
  title: string;
  certificate: string;
  description: string;
  questionsCount: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  timeLimitMinutes: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswerId?: string;
  category: string;           // NEW: e.g. "AWS Lambda", "Security", "Kubernetes"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPremium: boolean;         // NEW: true = paid content only
  tags?: string[];            // optional
  createdAt?: string;
  updatedAt?: string;
}

export interface Answer {
  questionId: string;
  selectedOptionId: string | null;
}

// Optional: add later for test templates
export interface TestTemplate {
  id: string;
  title: string;
  certificate: string;
  description?: string;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  isPremium: boolean;
  categories: string[];          // e.g. ["AWS Lambda", "IAM", "VPC"]
  passThreshold: number;         // e.g. 70
  createdAt?: string;
  updatedAt?: string;
}