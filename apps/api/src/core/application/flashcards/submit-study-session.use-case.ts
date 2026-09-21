import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';

export interface SubmitStudySessionInput {
  userId: string;
  topicId?: string;
  categoryId?: string;
  totalCards: number;
  correctOnFirstTry: number;
  totalAttempts: number;
}

/**
 * Caso de uso para registrar las estadísticas finales de una sesión de estudio de Flashcards.
 *
 * @class SubmitStudySessionUseCase
 */
@Injectable()
export class SubmitStudySessionUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  /**
   * Guarda el resumen de la sesión de estudio.
   *
   * @param {SubmitStudySessionInput} input Métricas de la sesión.
   * @returns {Promise<{ id: string }>} ID de la sesión registrada.
   */
  async execute(input: SubmitStudySessionInput): Promise<{ id: string }> {
    if (input.totalCards <= 0) {
      throw new BadRequestException('El total de tarjetas de la sesión debe ser mayor a 0');
    }

    return this.flashcardRepository.saveStudySession(input);
  }
}
