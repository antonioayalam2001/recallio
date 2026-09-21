import { Injectable, Inject } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';

@Injectable()
export class SaveFlashcardUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  async execute(flashcardId: string, userId: string): Promise<{ saved: boolean }> {
    return this.flashcardRepository.toggleSave(flashcardId, userId);
  }
}
