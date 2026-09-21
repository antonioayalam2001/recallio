import type { Word } from '../models/vocabulary';
import type { Flashcard } from '../models/flashcard';

export interface IAdminRepository {
  getPendingWords(): Promise<Word[]>;
  getPendingFlashcards(): Promise<Flashcard[]>;
  moderateWord(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void>;
  moderateFlashcard(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void>;
  generateInvite(email: string): Promise<{ token: string }>;
}
