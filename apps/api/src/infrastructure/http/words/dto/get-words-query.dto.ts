import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Level, WordStatus } from '@prisma/client';

import { Transform } from 'class-transformer';

/**
 * DTO para validar los parámetros de consulta (query params) de palabras,
 * incluyendo filtros por nivel, categoría, estado, término de búsqueda y paginación.
 *
 * @class GetWordsQueryDto
 */
export class GetWordsQueryDto {
  @IsOptional()
  @IsEnum(Level, { message: 'El nivel debe ser un valor válido (A1, A2, B1, B2, C1, C2)' })
  level?: Level;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  category?: string;

  @IsOptional()
  @IsEnum(WordStatus, { message: 'El estado debe ser PENDING_APPROVAL, APPROVED o REJECTED' })
  status?: WordStatus;

  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página mínima es 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  onlyMyDeck?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  forStudy?: boolean;
}
