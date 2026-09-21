import { Injectable, Inject } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';
import { CreateWordDto } from '../../../infrastructure/http/words/dto/create-word.dto';
import { Word } from '../../domain/entities/word.entity';
import { WordStatus } from '@prisma/client';

@Injectable()
export class CreateWordUseCase {
  constructor(@Inject(IWordRepository) private readonly wordRepository: IWordRepository) {}

  /**
   * Ejecuta la creación de una palabra propuesta por un usuario.
   * La palabra entra en estado PENDING_APPROVAL automáticamente.
   */
  async execute(dto: CreateWordDto, userId: string, userRole?: string): Promise<Word> {
    let initialStatus: WordStatus =
      userRole === 'ADMIN' ? WordStatus.APPROVED : WordStatus.PENDING_APPROVAL;
    if (dto.isPrivate) {
      initialStatus = WordStatus.PRIVATE;
    }
    // Si es una sugerencia de cambio de una palabra pública, SIEMPRE pasa a PENDING_APPROVAL para moderación
    if (dto.originalWordId) {
      initialStatus = WordStatus.PENDING_APPROVAL;
    }

    // Normalizar categoría a Title Case
    const normalizedCategory = dto.category
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return this.wordRepository.create({
      englishWord: dto.englishWord.trim(),
      spanishTranslation: dto.spanishTranslation.trim(),
      level: dto.level,
      category: normalizedCategory,
      exampleSentence: dto.exampleSentence ? dto.exampleSentence.trim() : null,
      exampleTranslation: dto.exampleTranslation ? dto.exampleTranslation.trim() : null,
      status: initialStatus,
      createdById: userId,
      reviewedById: null,
      originalWordId: dto.originalWordId || null,
    });
  }
}
