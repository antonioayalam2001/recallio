import { api } from '../api';
import type { Word, PaginatedResponse, SuggestWordDto } from '../../domain/models/vocabulary';
import type { IVocabularyRepository } from '../../domain/repositories/IVocabularyRepository';

export class VocabularyRepository implements IVocabularyRepository {
  async getWords(params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    level?: string;
    onlyMyDeck?: boolean;
  }): Promise<PaginatedResponse<Word>> {
    const response = await api.get<PaginatedResponse<Word>>('/words', { params });
    return response.data;
  }

  async suggestWord(data: SuggestWordDto): Promise<void> {
    await api.post('/words', data);
  }

  async toggleSave(wordId: string): Promise<{ saved: boolean }> {
    const response = await api.post(`/words/${wordId}/save`);
    return response.data;
  }

  async updateWord(wordId: string, data: Partial<SuggestWordDto>): Promise<void> {
    await api.patch(`/words/${wordId}`, data);
  }

  async deleteWord(wordId: string): Promise<void> {
    await api.delete(`/words/${wordId}`);
  }
}

export const vocabularyRepository = new VocabularyRepository();
