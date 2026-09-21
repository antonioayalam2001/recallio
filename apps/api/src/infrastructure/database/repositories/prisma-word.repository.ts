import { Injectable } from '@nestjs/common';
import {
  IWordRepository,
  WordFilters,
  PaginatedResult,
} from '../../../core/domain/repositories/word.repository.interface';
import { Word } from '../../../core/domain/entities/word.entity';
import { PrismaService } from '../prisma.service';
import { WordStatus, Level } from '@prisma/client';

/**
 * Adaptador de Salida: Implementación de IWordRepository usando Prisma.
 *
 * @class PrismaWordRepository
 * @implements {IWordRepository}
 */
@Injectable()
export class PrismaWordRepository implements IWordRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mapea un modelo de Prisma hacia una entidad pura de dominio.
   */
  private mapToDomain(prismaWord: any): Word {
    return new Word(
      prismaWord.id,
      prismaWord.englishWord,
      prismaWord.spanishTranslation,
      prismaWord.level,
      prismaWord.category,
      prismaWord.exampleSentence,
      prismaWord.exampleTranslation,
      prismaWord.status,
      prismaWord.createdById,
      prismaWord.reviewedById,
      prismaWord.createdAt,
      prismaWord.originalWordId,
      prismaWord.originalWord ? this.mapToDomain(prismaWord.originalWord) : null,
      prismaWord._count?.suggestions,
      prismaWord.savedBy ? prismaWord.savedBy.length > 0 : undefined,
    );
  }

  async findById(id: string): Promise<Word | null> {
    const word = await this.prisma.word.findUnique({
      where: { id },
      include: { originalWord: true },
    });
    if (!word) return null;
    return this.mapToDomain(word);
  }

  private buildWhereClause(filters?: WordFilters): any {
    const where: any = {};
    if (filters?.level) where.level = filters.level;
    if (filters?.categories && filters.categories.length > 0) {
      where.category = { in: filters.categories, mode: 'insensitive' };
    } else if (filters?.category) {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }

    // Si queremos el "Mazo Propio"
    if (filters?.onlyMyDeck && filters?.requesterId) {
      where.OR = [
        { createdById: filters.requesterId },
        { savedBy: { some: { userId: filters.requesterId } } },
      ];
      // Si se buscó también status (ej. APPROVED) lo aplicamos con AND
      if (filters.status) {
        where.AND = [{ status: filters.status }];
      }
    } else {
      // Búsqueda global
      if (filters?.status) {
        where.status = filters.status;
        if (filters.status !== WordStatus.PENDING_APPROVAL) {
          where.originalWordId = null;
        }
      } else {
        // En el mazo público SOLO mostramos palabras aprobadas por defecto.
        where.status = WordStatus.APPROVED;
        where.originalWordId = null;
      }
    }

    if (filters?.search) {
      const searchBlock = {
        OR: [
          { englishWord: { contains: filters.search, mode: 'insensitive' } },
          { spanishTranslation: { contains: filters.search, mode: 'insensitive' } },
        ],
      };

      // Si ya existía un OR (por onlyMyDeck), lo pasamos a un AND
      if (where.OR) {
        where.AND = where.AND ? [...where.AND, searchBlock] : [searchBlock];
      } else {
        where.OR = searchBlock.OR;
      }
    }

    if (filters?.forStudy && filters?.requesterId) {
      const now = new Date();
      const studyCondition = {
        OR: [
          { reviews: { none: { userId: filters.requesterId } } },
          { reviews: { some: { userId: filters.requesterId, nextReviewDate: { lte: now } } } },
        ],
      };

      if (where.AND) {
        where.AND.push(studyCondition);
      } else {
        where.AND = [studyCondition];
      }
    }

    return where;
  }

  async findAll(filters?: WordFilters): Promise<Word[]> {
    const where = this.buildWhereClause(filters);
    const words = await this.prisma.word.findMany({
      where,
      include: {
        originalWord: true,
        reviews:
          filters?.forStudy && filters?.requesterId
            ? { where: { userId: filters.requesterId } }
            : false,
        savedBy: filters?.requesterId
          ? { where: { userId: filters.requesterId }, select: { userId: true } }
          : false,
        _count: {
          select: { suggestions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (filters?.forStudy && filters?.requesterId) {
      words.sort((a, b) => {
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

    return words.map((w) => this.mapToDomain(w));
  }

  async findPaginated(filters?: WordFilters): Promise<PaginatedResult<Word>> {
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.max(1, Math.min(100, filters?.limit || 12));
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [total, words] = await Promise.all([
      this.prisma.word.count({ where }),
      this.prisma.word.findMany({
        where,
        skip,
        take: limit,
        include: {
          originalWord: true,
          reviews:
            filters?.forStudy && filters?.requesterId
              ? { where: { userId: filters.requesterId } }
              : false,
          savedBy: filters?.requesterId
            ? { where: { userId: filters.requesterId }, select: { userId: true } }
            : false,
          _count: {
            select: { suggestions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (filters?.forStudy && filters?.requesterId) {
      words.sort((a, b) => {
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

    const totalPages = Math.ceil(total / limit);

    return {
      data: words.map((w) => this.mapToDomain(w)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  async create(word: Omit<Word, 'id' | 'createdAt'>): Promise<Word> {
    const created = await this.prisma.word.create({
      data: {
        englishWord: word.englishWord,
        spanishTranslation: word.spanishTranslation,
        level: word.level,
        category: word.category,
        exampleSentence: word.exampleSentence,
        exampleTranslation: word.exampleTranslation,
        status: word.status,
        createdById: word.createdById,
        originalWordId: word.originalWordId,
      },
    });
    return this.mapToDomain(created);
  }

  async updateStatus(id: string, status: WordStatus, adminId: string): Promise<Word> {
    const updated = await this.prisma.word.update({
      where: { id },
      data: {
        status,
        reviewedById: adminId,
      },
    });
    return this.mapToDomain(updated);
  }

  async toggleSave(wordId: string, userId: string): Promise<{ saved: boolean }> {
    const existing = await this.prisma.savedWord.findUnique({
      where: {
        userId_wordId: { userId, wordId },
      },
    });

    if (existing) {
      await this.prisma.savedWord.delete({
        where: { userId_wordId: { userId, wordId } },
      });
      return { saved: false };
    }

    await this.prisma.savedWord.create({
      data: { userId, wordId },
    });
    return { saved: true };
  }

  async review(wordId: string, userId: string, quality: number): Promise<void> {
    const existing = await this.prisma.wordReview.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    const currentRepetitions = existing ? existing.repetitions : 0;
    const currentEaseFactor = existing ? existing.easeFactor : 2.5;
    const currentInterval = existing ? existing.interval : 0;

    const { calculateSM2 } = require('../../../core/application/srs/sm2');
    const result = calculateSM2(quality, currentRepetitions, currentEaseFactor, currentInterval);

    await this.prisma.wordReview.upsert({
      where: { userId_wordId: { userId, wordId } },
      create: {
        userId,
        wordId,
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

  async updateWord(id: string, data: Partial<Omit<Word, 'id' | 'createdAt'>>): Promise<Word> {
    const { originalWord, ...updateData } = data;
    const updated = await this.prisma.word.update({
      where: { id },
      data: updateData as any,
    });
    return this.mapToDomain(updated);
  }

  async deleteWord(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.savedWord.deleteMany({ where: { wordId: id } }),
      this.prisma.wordReview.deleteMany({ where: { wordId: id } }),
      this.prisma.gameAnswer.deleteMany({ where: { wordId: id } }),
      this.prisma.word.delete({ where: { id } }),
    ]);
  }

  async getCategoriesWithCount(filters?: {
    level?: Level;
    status?: WordStatus;
  }): Promise<{ category: string; count: number }[]> {
    const where: any = {};
    if (filters?.level) where.level = filters.level;
    if (filters?.status) {
      where.status = filters.status;
    } else {
      where.status = WordStatus.APPROVED;
    }

    const groups = await this.prisma.word.groupBy({
      by: ['category'],
      where,
      _count: { id: true },
      orderBy: { category: 'asc' },
    });

    return groups
      .filter((g) => g.category && g.category.trim() !== '')
      .map((g) => ({
        category: g.category,
        count: g._count.id,
      }));
  }
}
