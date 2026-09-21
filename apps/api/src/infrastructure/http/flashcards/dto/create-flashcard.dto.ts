import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO para la creación de una nueva Flashcard.
 */
export class CreateFlashcardDto {
  @IsString({ message: 'El anverso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El anverso no puede estar vacío' })
  front!: string;

  @IsString({ message: 'El reverso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El reverso no puede estar vacío' })
  back!: string;

  @IsString({ message: 'El grupo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El grupo no puede estar vacío' })
  groupName!: string;

  @IsString({ message: 'El tema debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tema no puede estar vacío' })
  topicName!: string;

  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  categoryName!: string;

  @IsBoolean({ message: 'isPrivate debe ser un valor booleano' })
  @IsOptional()
  isPrivate?: boolean;

  @IsString()
  @IsOptional()
  originalFlashcardId?: string;
}
