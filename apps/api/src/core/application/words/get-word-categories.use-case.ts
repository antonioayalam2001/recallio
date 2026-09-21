import { Injectable, Inject } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';
import { Level, WordStatus } from '@prisma/client';

@Injectable()
export class GetWordCategoriesUseCase {
  constructor(@Inject(IWordRepository) private readonly wordRepository: IWordRepository) {}

  async execute(filters?: {
    level?: Level;
    status?: WordStatus;
  }): Promise<{ category: string; count: number }[]> {
    return this.wordRepository.getCategoriesWithCount(filters);
  }
}
