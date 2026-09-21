import type { Word, PaginatedResponse, SuggestWordDto } from '../models/vocabulary';

export interface IVocabularyRepository {
  getWords(params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    level?: string;
    onlyMyDeck?: boolean;
    forStudy?: boolean;
  }): Promise<PaginatedResponse<Word>>;
  suggestWord(data: SuggestWordDto): Promise<void>;
  toggleSave(wordId: string): Promise<{ saved: boolean }>;
  updateWord(wordId: string, data: Partial<SuggestWordDto>): Promise<void>;
  deleteWord(wordId: string): Promise<void>;
}
