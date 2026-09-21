import type { ContentStatus } from './shared';

export interface Category {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  categories: Category[];
}

export interface Group {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: ContentStatus;
  group?: Group;
  topic?: Topic;
  category?: Category;
  groupName?: string;
  topicName?: string;
  categoryName?: string;
  createdByName?: string;
  originalFlashcardId?: string | null;
  originalFlashcard?: Flashcard | null;
}

export interface CreateFlashcardDto {
  groupName: string;
  topicName: string;
  categoryName: string;
  front: string;
  back: string;
}
