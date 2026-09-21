import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';
import { Word } from '../../domain/entities/word.entity';
import { WordStatus } from '@prisma/client';

@Injectable()
export class ModerateWordUseCase {
  constructor(@Inject(IWordRepository) private readonly wordRepository: IWordRepository) {}

  /**
   * Actualiza el estado de una palabra para ser aprobada o rechazada por un admin.
   */
  async execute(wordId: string, status: WordStatus, adminId: string): Promise<Word> {
    const word = await this.wordRepository.findById(wordId);
    if (!word) {
      throw new NotFoundException('Palabra no encontrada');
    }

    // Si es una sugerencia de cambio sobre una palabra existente
    if (word.originalWordId) {
      if (status === WordStatus.APPROVED) {
        const updatedOriginal = await this.wordRepository.updateWord(word.originalWordId, {
          englishWord: word.englishWord,
          spanishTranslation: word.spanishTranslation,
          level: word.level,
          category: word.category,
          exampleSentence: word.exampleSentence,
          exampleTranslation: word.exampleTranslation,
        });
        await this.wordRepository.deleteWord(wordId);
        return updatedOriginal;
      } else {
        await this.wordRepository.deleteWord(wordId);
        return word;
      }
    }

    return this.wordRepository.updateStatus(wordId, status, adminId);
  }
}
