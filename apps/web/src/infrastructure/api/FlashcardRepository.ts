import { api } from '../api';
import type { Flashcard, Group, CreateFlashcardDto } from '../../domain/models/flashcard';
import type { PaginatedResponse } from '../../domain/models/vocabulary';
import type { IFlashcardRepository } from '../../domain/repositories/IFlashcardRepository';

export class FlashcardRepository implements IFlashcardRepository {
  async getFlashcards(params: {
    page?: number;
    limit?: number;
    groupId?: string;
    topicId?: string;
    categoryId?: string;
    search?: string;
    status?: string;
    onlyMyDeck?: boolean;
    forStudy?: boolean;
  }): Promise<PaginatedResponse<Flashcard>> {
    const response = await api.get<PaginatedResponse<Flashcard>>('/flashcards', { params });
    // Normalize to PaginatedResponse if the API doesn't return one directly yet
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        meta: {
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          totalPages: 1,
          hasMore: false,
        },
      };
    }
    return response.data;
  }

  async getTaxonomies(): Promise<Group[]> {
    const response = await api.get<Group[]>('/flashcards/taxonomies');
    return response.data;
  }

  async createFlashcard(data: CreateFlashcardDto): Promise<void> {
    await api.post('/flashcards', data);
  }

  async submitStudySession(data: Record<string, unknown>): Promise<void> {
    await api.post('/flashcards/study-session', data);
  }

  async toggleSave(flashcardId: string): Promise<{ saved: boolean }> {
    const response = await api.post(`/flashcards/${flashcardId}/save`);
    return response.data;
  }

  async reviewFlashcard(flashcardId: string, quality: number): Promise<void> {
    await api.post(`/flashcards/${flashcardId}/review`, { quality });
  }

  async updateFlashcard(flashcardId: string, data: Partial<CreateFlashcardDto>): Promise<void> {
    await api.patch(`/flashcards/${flashcardId}`, data);
  }

  async deleteFlashcard(flashcardId: string): Promise<void> {
    await api.delete(`/flashcards/${flashcardId}`);
  }
}

export const flashcardRepository = new FlashcardRepository();
