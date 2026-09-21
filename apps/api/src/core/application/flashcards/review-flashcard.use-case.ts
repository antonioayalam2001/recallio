import { Injectable, Inject } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';

@Injectable()
export class ReviewFlashcardUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  async execute(flashcardId: string, userId: string, quality: number): Promise<void> {
    await this.flashcardRepository.review(flashcardId, userId, quality);
  }
}
