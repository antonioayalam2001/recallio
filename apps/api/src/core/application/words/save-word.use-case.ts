import { Injectable, Inject } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';

@Injectable()
export class SaveWordUseCase {
  constructor(
    @Inject(IWordRepository)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(wordId: string, userId: string): Promise<{ saved: boolean }> {
    return this.wordRepository.toggleSave(wordId, userId);
  }
}
