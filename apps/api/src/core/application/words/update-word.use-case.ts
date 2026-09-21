import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';
import { Word } from '../../domain/entities/word.entity';
import { WordStatus } from '@prisma/client';

@Injectable()
export class UpdateWordUseCase {
  constructor(
    @Inject(IWordRepository)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    data: Partial<Omit<Word, 'id' | 'createdAt'>>,
    userRole?: string,
  ): Promise<Word> {
    const word = await this.wordRepository.findById(id);
    if (!word) {
      throw new NotFoundException('Palabra no encontrada');
    }

    const isAuthor = word.createdById === userId;
    const isPrivate = word.status === WordStatus.PRIVATE;
    const isAdmin = userRole === 'ADMIN';

    if (!isAdmin && (!isAuthor || !isPrivate)) {
      throw new ForbiddenException('No tienes permisos para editar directamente esta palabra.');
    }

    const updatePayload = { ...data };
    if (updatePayload.category) {
      updatePayload.category = updatePayload.category
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }

    return this.wordRepository.updateWord(id, updatePayload);
  }
}
