

export interface PracticeTest {
  id: string;
  templateId?: string;        // ← link back to template (optional)
  title: string;
  certificate: string;
  description?: string;
  durationMinutes: number;
  questionsCount: number;     // redundant with questions.length, but ok for preview
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  isPremium?: boolean;
  passThreshold?: number;      // from template
  questions: Question[];      // the actual selected questions
  createdAt?: string;
  updatedAt?: string;
  tags: string[]
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswerId: 'a' | 'b' | 'c' | 'd';
  categoryId: number;           // NEW: e.g. "AWS Lambda", "Security", "Kubernetes"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPremium: boolean;         // NEW: true = paid content only
  tags?: string[];            // optional
  createdAt?: string;
  updatedAt?: string;
}

export interface Answer {
  questionId: string;
  selectedOptionId: string | null;  // 'a'|'b'|'c'|'d' | null
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

export interface Category {
  id: number;
  name: string;               // e.g. "AWS Lambda"
  status: 1 | 0;
  createdAt?: string;
  updatedAt?: string;
}

export interface Option {
  id: 'a' | 'b' | 'c' | 'd';  // consistent with question bank
  text: string;
}