import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Level } from '@prisma/client';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  englishWord!: string;

  @IsString()
  @IsNotEmpty()
  spanishTranslation!: string;

  @IsEnum(Level)
  @IsNotEmpty()
  level!: Level;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @IsString()
  exampleSentence?: string;

  @IsOptional()
  @IsString()
  exampleTranslation?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsString()
  originalWordId?: string;
}
