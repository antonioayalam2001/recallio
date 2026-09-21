import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';
import { WordStatus } from '@prisma/client';

@Injectable()
export class DeleteWordUseCase {
  constructor(
    @Inject(IWordRepository)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(id: string, userId: string, userRole?: string): Promise<void> {
    const word = await this.wordRepository.findById(id);
    if (!word) {
      throw new NotFoundException('Palabra no encontrada');
    }

    const isAdmin = userRole === 'ADMIN';
    const isOwner = word.createdById === userId;
    const canDelete =
      isAdmin ||
      (isOwner &&
        (word.status === WordStatus.PRIVATE || word.status === WordStatus.PENDING_APPROVAL));

    if (!canDelete) {
      throw new ForbiddenException('No tienes permisos para eliminar esta palabra');
    }

    await this.wordRepository.deleteWord(id);
  }
}
