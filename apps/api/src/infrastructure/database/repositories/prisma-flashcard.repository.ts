import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IFlashcardRepository,
  FlashcardFilters,
  GroupWithTopics,
  TopicWithCategories,
} from '../../../core/domain/repositories/flashcard.repository.interface';
import { FlashcardEntity } from '../../../core/domain/entities/flashcard.entity';
import {
  GroupEntity,
  TopicEntity,
  CategoryEntity,
} from '../../../core/domain/entities/taxonomy.entity';
import { WordStatus } from '@prisma/client';

/**
 * Adaptador de infraestructura con Prisma ORM para persistencia de Flashcards.
 *
 * @class PrismaFlashcardRepository
 * @implements {IFlashcardRepository}
 */
@Injectable()
export class PrismaFlashcardRepository implements IFlashcardRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mapea un modelo de Prisma Flashcard a la entidad pura de dominio.
   */
  private toEntity(raw: any): FlashcardEntity {
    return new FlashcardEntity(
      raw.id,
      raw.front,
      raw.back,
      raw.groupId,
      raw.topicId,
      raw.categoryId,
      raw.createdById,
      raw.status,
      raw.reviewedById,
      raw.group?.name,
      raw.topic?.name,
      raw.category?.name,
      raw.createdBy?.name,
      raw.createdAt,
      raw.updatedAt,
      raw.originalFlashcardId,
      raw.originalFlashcard ? this.toEntity(raw.originalFlashcard) : null,
    );
  }

  async createFlashcard(data: {
    front: string;
    back: string;
    groupId: string;
    topicId: string;
    categoryId: string;
    createdById: string;
    status?: WordStatus;
    originalFlashcardId?: string;
  }): Promise<FlashcardEntity> {
    const created = await this.prisma.flashcard.create({
      data: {
        front: data.front,
        back: data.back,
        groupId: data.groupId,
        topicId: data.topicId,
        categoryId: data.categoryId,
        createdById: data.createdById,
        status: data.status || WordStatus.PENDING_APPROVAL,
        originalFlashcardId: data.originalFlashcardId,
      },
      include: {
        group: true,
        topic: true,
        category: true,
        createdBy: true,
      },
    });
    return this.toEntity(created);
  }

  async findById(id: string): Promise<FlashcardEntity | null> {
    const found = await this.prisma.flashcard.findUnique({
      where: { id },
      include: {
        group: true,
        topic: true,
        category: true,
        createdBy: true,
        originalFlashcard: {
          include: {
            group: true,
            topic: true,
            category: true,
          },
        },
      },
    });
    return found ? this.toEntity(found) : null;
  }

  async findAll(filters?: FlashcardFilters): Promise<FlashcardEntity[]> {
    const where: any = {};
    if (filters?.groupId) where.groupId = filters.groupId;
    if (filters?.topicId) where.topicId = filters.topicId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;

    // Si queremos el "Mazo Propio"
    if (filters?.onlyMyDeck && filters?.requesterId) {
      where.OR = [
        { createdById: filters.requesterId },
        { savedBy: { some: { userId: filters.requesterId } } },
      ];
      if (filters.status) {
        where.AND = [{ status: filters.status }];
      }
    } else {
      // Búsqueda global
      if (filters?.status) {
        where.status = filters.status;
        if (filters.status !== WordStatus.PENDING_APPROVAL) {
          where.originalFlashcardId = null;
        }
      } else {
        where.status = WordStatus.APPROVED;
        where.originalFlashcardId = null;
      }
    }

    if (filters?.forStudy && filters?.requesterId) {
      const now = new Date();
      // Solo estudiar cartas que no tienen review, o que su nextReviewDate es <= ahora
      const studyCondition = {
        OR: [
          { reviews: { none: { userId: filters.requesterId } } }, // Nunca estudiada
          { reviews: { some: { userId: filters.requesterId, nextReviewDate: { lte: now } } } }, // Toca repasar
        ],
      };

      if (where.AND) {
        where.AND.push(studyCondition);
      } else {
        where.AND = [studyCondition];
      }
    }

    if (filters?.search) {
      const searchBlock = {
        OR: [
          { front: { contains: filters.search, mode: 'insensitive' } },
          { back: { contains: filters.search, mode: 'insensitive' } },
        ],
      };
      if (where.OR) {
        where.AND = where.AND ? [...where.AND, searchBlock] : [searchBlock];
      } else {
        where.OR = searchBlock.OR;
      }
    }

    const list = await this.prisma.flashcard.findMany({
      where,
      include: {
        group: true,
        topic: true,
        category: true,
        createdBy: true,
        originalFlashcard: {
          include: {
            group: true,
            topic: true,
            category: true,
          },
        },
        // Si estamos estudiando, traemos el review para ordenar en memoria si fuera necesario
        reviews:
          filters?.forStudy && filters?.requesterId
            ? { where: { userId: filters.requesterId } }
            : false,
      },
      // Orden por defecto
      orderBy: { createdAt: 'desc' },
    });

    if (filters?.forStudy && filters?.requesterId) {
      // Ordenar: primero las que ya tienen un review pendiente, luego las nuevas
      list.sort((a, b) => {
        const reviewA = a.reviews?.[0];
        const reviewB = b.reviews?.[0];
        if (reviewA && !reviewB) return -1;
        if (!reviewA && reviewB) return 1;
        if (reviewA && reviewB) {
          return reviewA.nextReviewDate.getTime() - reviewB.nextReviewDate.getTime();
        }
        return 0;
      });
    }

    return list.map((item) => this.toEntity(item));
  }

  async updateStatus(
    id: string,
    status: WordStatus,
    reviewedById: string,
  ): Promise<FlashcardEntity> {
    const updated = await this.prisma.flashcard.update({
      where: { id },
      data: {
        status,
        reviewedById,
      },
      include: {
        group: true,
        topic: true,
        category: true,
        createdBy: true,
      },
    });
    return this.toEntity(updated);
  }

  async findOrCreateGroup(name: string, description?: string): Promise<GroupEntity> {
    const group = await this.prisma.group.upsert({
      where: { name },
      update: {},
      create: { name, description },
    });
    return new GroupEntity(group.id, group.name, group.description, group.createdAt);
  }

  async findOrCreateTopic(
    groupId: string,
    name: string,
    description?: string,
  ): Promise<TopicEntity> {
    const topic = await this.prisma.topic.upsert({
      where: { groupId_name: { groupId, name } },
      update: {},
      create: { groupId, name, description },
    });
    return new TopicEntity(topic.id, topic.name, topic.groupId, topic.description, topic.createdAt);
  }

  async findOrCreateCategory(topicId: string, name: string): Promise<CategoryEntity> {
    const category = await this.prisma.category.upsert({
      where: {
        topicId_name: { topicId, name },
      },
      update: {},
      create: { name, topicId },
    });
    return new CategoryEntity(category.id, category.name, category.topicId, category.createdAt);
  }

  async getTaxonomiesTree(): Promise<GroupWithTopics[]> {
    const groups = await this.prisma.group.findMany({
      include: {
        topics: {
          include: {
            categories: {
              orderBy: { name: 'asc' },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      createdAt: g.createdAt,
      topics: g.topics.map((t) => ({
        id: t.id,
        name: t.name,
        groupId: t.groupId,
        description: t.description,
        createdAt: t.createdAt,
        categories: t.categories.map(
          (c) => new CategoryEntity(c.id, c.name, c.topicId, c.createdAt),
        ),
      })),
    }));
  }

  async saveStudySession(data: {
    userId: string;
    groupId?: string;
    topicId?: string;
    categoryId?: string;
    totalCards: number;
    correctOnFirstTry: number;
    totalAttempts: number;
  }): Promise<{ id: string }> {
    const session = await this.prisma.flashcardStudySession.create({
      data: {
        userId: data.userId,
        topicId: data.topicId,
        categoryId: data.categoryId,
        totalCards: data.totalCards,
        correctOnFirstTry: data.correctOnFirstTry,
        totalAttempts: data.totalAttempts,
      },
    });
    return { id: session.id };
  }

  async toggleSave(flashcardId: string, userId: string): Promise<{ saved: boolean }> {
    const existing = await this.prisma.savedFlashcard.findUnique({
      where: {
        userId_flashcardId: { userId, flashcardId },
      },
    });

    if (existing) {
      await this.prisma.savedFlashcard.delete({
        where: { userId_flashcardId: { userId, flashcardId } },
      });
      return { saved: false };
    }

    await this.prisma.savedFlashcard.create({
      data: { userId, flashcardId },
    });
    return { saved: true };
  }

  async review(flashcardId: string, userId: string, quality: number): Promise<void> {
    const existing = await this.prisma.flashcardReview.findUnique({
      where: { userId_flashcardId: { userId, flashcardId } },
    });

    const currentRepetitions = existing ? existing.repetitions : 0;
    const currentEaseFactor = existing ? existing.easeFactor : 2.5;
    const currentInterval = existing ? existing.interval : 0;

    // Importing calculateSM2 requires us to add it at the top, or just require it here
    const { calculateSM2 } = require('../../../core/application/srs/sm2');
    const result = calculateSM2(quality, currentRepetitions, currentEaseFactor, currentInterval);

    await this.prisma.flashcardReview.upsert({
      where: { userId_flashcardId: { userId, flashcardId } },
      create: {
        userId,
        flashcardId,
        repetitions: result.repetitions,
        easeFactor: result.easeFactor,
        interval: result.interval,
        nextReviewDate: result.nextReviewDate,
      },
      update: {
        repetitions: result.repetitions,
        easeFactor: result.easeFactor,
        interval: result.interval,
        nextReviewDate: result.nextReviewDate,
      },
    });
  }

  async updateFlashcard(
    id: string,
    data: Partial<{
      front: string;
      back: string;
      groupId: string;
      topicId: string;
      categoryId: string;
    }>,
  ): Promise<FlashcardEntity> {
    const updated = await this.prisma.flashcard.update({
      where: { id },
      data,
      include: { group: true, topic: true, category: true },
    });
    return this.toEntity(updated);
  }

  async deleteFlashcard(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.savedFlashcard.deleteMany({ where: { flashcardId: id } }),
      this.prisma.flashcardReview.deleteMany({ where: { flashcardId: id } }),
      this.prisma.flashcard.delete({ where: { id } }),
    ]);
  }
}
