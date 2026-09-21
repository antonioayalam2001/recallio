import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewDto {
  @Type(() => Number)
  @IsInt({ message: 'La calidad debe ser un número entero' })
  @Min(0, { message: 'La calidad mínima es 0' })
  @Max(5, { message: 'La calidad máxima es 5' })
  quality!: number;
}
