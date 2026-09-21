import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { WordStatus } from '@prisma/client';

@Injectable()
export class DeleteFlashcardUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  async execute(id: string, userId: string, userRole?: string): Promise<void> {
    const flashcard = await this.flashcardRepository.findById(id);
    if (!flashcard) {
      throw new NotFoundException('Flashcard no encontrada');
    }

    const isAdmin = userRole === 'ADMIN';
    const isOwner = flashcard.createdById === userId;
    const canDelete =
      isAdmin ||
      (isOwner &&
        (flashcard.status === WordStatus.PRIVATE ||
          flashcard.status === WordStatus.PENDING_APPROVAL));

    if (!canDelete) {
      throw new ForbiddenException('No tienes permisos para eliminar esta tarjeta');
    }

    await this.flashcardRepository.deleteFlashcard(id);
  }
}
