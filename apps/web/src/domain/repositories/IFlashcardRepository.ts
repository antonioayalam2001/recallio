import type { Flashcard, Group, CreateFlashcardDto } from '../models/flashcard';
import type { PaginatedResponse } from '../models/vocabulary';

export interface IFlashcardRepository {
  getFlashcards(params: {
    page?: number;
    limit?: number;
    groupId?: string;
    topicId?: string;
    categoryId?: string;
    search?: string;
    status?: string;
    onlyMyDeck?: boolean;
    forStudy?: boolean;
  }): Promise<PaginatedResponse<Flashcard>>;
  getTaxonomies(): Promise<Group[]>;
  createFlashcard(data: CreateFlashcardDto): Promise<void>;
  submitStudySession(data: Record<string, unknown>): Promise<void>;
  toggleSave(flashcardId: string): Promise<{ saved: boolean }>;
  reviewFlashcard(flashcardId: string, quality: number): Promise<void>;
  updateFlashcard(id: string, data: Partial<CreateFlashcardDto>): Promise<void>;
  deleteFlashcard(id: string): Promise<void>;
}
