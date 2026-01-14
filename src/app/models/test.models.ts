

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
}

export interface Answer {
  questionId: string;
  selectedOptionId: string | null;
}