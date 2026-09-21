import { Injectable, Inject } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';

@Injectable()
export class ReviewWordUseCase {
  constructor(
    @Inject(IWordRepository)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(wordId: string, userId: string, quality: number): Promise<void> {
    await this.wordRepository.review(wordId, userId, quality);
  }
}
