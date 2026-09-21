import { IsEnum, IsNotEmpty } from 'class-validator';
import { WordStatus } from '@prisma/client';

/**
 * DTO para la moderación de una Flashcard por parte de un administrador.
 */
export class ModerateFlashcardDto {
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(WordStatus, { message: 'Estado inválido. Debe ser APPROVED o REJECTED' })
  status!: WordStatus;
}
