import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsStrongPasswordConstraint } from './register.dto';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'El token es obligatorio' })
  token!: string;

  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @Validate(IsStrongPasswordConstraint)
  newPassword!: string;

  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria' })
  confirmNewPassword!: string;
}
