import { IsEnum, IsNotEmpty } from 'class-validator';
import { WordStatus } from '@prisma/client';

export class ModerateWordDto {
  @IsEnum(WordStatus)
  @IsNotEmpty()
  status!: WordStatus;
}
