export interface SystemStats {
  totalWords: number;
  totalUsers: number;
  totalFlashcards: number;
}

export interface PendingItem {
  id: string;
  type: 'word' | 'flashcard';
  title: string;
  subtitle: string;
  details?: Record<string, unknown>;
  createdAt: string;
  authorId?: string;
  // para palabras
  englishWord?: string;
  spanishTranslation?: string;
  category?: string;
  level?: string;
  examples?: string[];
  // para flashcards
  front?: string;
  back?: string;
}
