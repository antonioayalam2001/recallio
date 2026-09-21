import { IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * DTO para registrar los resultados de una sesión de estudio de Flashcards.
 */
export class SubmitStudySessionDto {
  @IsOptional()
  @IsString()
  topicId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsInt()
  @Min(1)
  totalCards!: number;

  @IsInt()
  @Min(0)
  correctOnFirstTry!: number;

  @IsInt()
  @Min(0)
  totalAttempts!: number;
}
