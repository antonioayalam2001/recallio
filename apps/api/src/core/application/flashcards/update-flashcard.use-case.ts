import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { WordStatus } from '@prisma/client';

@Injectable()
export class UpdateFlashcardUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    data: Partial<{
      front: string;
      back: string;
      groupId: string;
      topicId: string;
      categoryId: string;
    }>,
    userRole?: string,
  ): Promise<FlashcardEntity> {
    const flashcard = await this.flashcardRepository.findById(id);
    if (!flashcard) {
      throw new NotFoundException('Flashcard no encontrada');
    }

    const isAuthor = flashcard.createdById === userId;
    const isPrivate = flashcard.status === WordStatus.PRIVATE;
    const isAdmin = userRole === 'ADMIN';

    if (!isAdmin && (!isAuthor || !isPrivate)) {
      throw new ForbiddenException('No tienes permisos para editar directamente esta tarjeta.');
    }

    return this.flashcardRepository.updateFlashcard(id, data);
  }
}
