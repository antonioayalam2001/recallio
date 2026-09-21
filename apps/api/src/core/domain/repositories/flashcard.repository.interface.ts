import { FlashcardEntity } from '../entities/flashcard.entity';
import { GroupEntity, TopicEntity, CategoryEntity } from '../entities/taxonomy.entity';
import { WordStatus } from '@prisma/client';

export interface FlashcardFilters {
  groupId?: string;
  topicId?: string;
  categoryId?: string;
  status?: WordStatus;
  requesterId?: string;
  onlyMyDeck?: boolean;
  forStudy?: boolean;
  search?: string;
}

export interface GroupWithTopics extends GroupEntity {
  topics: TopicWithCategories[];
}

export interface TopicWithCategories extends TopicEntity {
  categories: CategoryEntity[];
}

export const IFlashcardRepository = Symbol('IFlashcardRepository');

/**
 * Puerto secundario (Interface de repositorio) para la persistencia
 * de Flashcards, Grupos, Temas y Categorías.
 */
export interface IFlashcardRepository {
  createFlashcard(data: {
    front: string;
    back: string;
    groupId: string;
    topicId: string;
    categoryId: string;
    createdById: string;
    status?: WordStatus;
    originalFlashcardId?: string;
  }): Promise<FlashcardEntity>;

  findById(id: string): Promise<FlashcardEntity | null>;

  findAll(filters?: FlashcardFilters): Promise<FlashcardEntity[]>;

  updateStatus(id: string, status: WordStatus, reviewedById: string): Promise<FlashcardEntity>;

  findOrCreateGroup(name: string, description?: string): Promise<GroupEntity>;

  findOrCreateTopic(groupId: string, name: string, description?: string): Promise<TopicEntity>;

  findOrCreateCategory(topicId: string, name: string): Promise<CategoryEntity>;

  getTaxonomiesTree(): Promise<GroupWithTopics[]>;

  saveStudySession(data: {
    userId: string;
    groupId?: string;
    topicId?: string;
    categoryId?: string;
    totalCards: number;
    correctOnFirstTry: number;
    totalAttempts: number;
  }): Promise<{ id: string }>;

  toggleSave(flashcardId: string, userId: string): Promise<{ saved: boolean }>;

  review(flashcardId: string, userId: string, quality: number): Promise<void>;

  updateFlashcard(
    id: string,
    data: Partial<{
      front: string;
      back: string;
      groupId: string;
      topicId: string;
      categoryId: string;
    }>,
  ): Promise<FlashcardEntity>;

  deleteFlashcard(id: string): Promise<void>;
}
