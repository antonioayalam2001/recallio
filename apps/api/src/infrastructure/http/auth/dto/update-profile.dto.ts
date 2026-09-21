import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'El apellido paterno debe tener entre 2 y 50 caracteres' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'El apellido materno debe tener entre 2 y 50 caracteres' })
  motherLastName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 20, { message: 'El nickname debe tener entre 3 y 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'El nickname solo puede contener letras, números y guiones bajos',
  })
  nickname?: string;
}
