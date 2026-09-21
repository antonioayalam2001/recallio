import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { WordStatus } from '@prisma/client';

/**
 * Caso de uso para que un Administrador apruebe o rechace una Flashcard pendiente.
 *
 * @class ModerateFlashcardUseCase
 */
@Injectable()
export class ModerateFlashcardUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  /**
   * Modera una flashcard existente.
   *
   * @param {string} flashcardId ID de la flashcard.
   * @param {WordStatus} status Nuevo estado (APPROVED o REJECTED).
   * @param {string} adminId ID del administrador revisor.
   * @returns {Promise<FlashcardEntity>} La flashcard actualizada.
   */
  async execute(
    flashcardId: string,
    status: WordStatus,
    adminId: string,
  ): Promise<FlashcardEntity> {
    if (status === WordStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'El estado no puede ser cambiado nuevamente a PENDING_APPROVAL',
      );
    }

    const card = await this.flashcardRepository.findById(flashcardId);
    if (!card) {
      throw new NotFoundException(`La flashcard con ID ${flashcardId} no existe`);
    }

    // Si es una sugerencia de cambio sobre una flashcard existente
    if (card.originalFlashcardId) {
      if (status === WordStatus.APPROVED) {
        const updatedOriginal = await this.flashcardRepository.updateFlashcard(
          card.originalFlashcardId,
          {
            front: card.front,
            back: card.back,
            groupId: card.groupId,
            topicId: card.topicId,
            categoryId: card.categoryId,
          },
        );
        await this.flashcardRepository.deleteFlashcard(flashcardId);
        return updatedOriginal;
      } else {
        await this.flashcardRepository.deleteFlashcard(flashcardId);
        return card;
      }
    }

    return this.flashcardRepository.updateStatus(flashcardId, status, adminId);
  }
}
