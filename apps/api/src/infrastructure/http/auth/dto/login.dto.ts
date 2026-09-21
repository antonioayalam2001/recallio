import { IsEmail, IsNotEmpty, IsBoolean, IsOptional, Validate } from 'class-validator';
import { IsStrongPasswordConstraint } from './register.dto';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Validate(IsStrongPasswordConstraint)
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
