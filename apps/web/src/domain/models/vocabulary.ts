import type { ContentStatus } from './shared';

export interface Word {
  id: string;
  englishWord: string;
  spanishTranslation: string;
  category: string;
  level: string;
  pronunciation?: string;
  examples: string[];
  status: ContentStatus;
  createdById?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  originalWordId?: string | null;
  originalWord?: Word | null;
  suggestionsCount?: number;
  isSaved?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface SuggestWordDto {
  englishWord: string;
  spanishTranslation: string;
  category: string;
  level: string;
  examples: string[];
}
