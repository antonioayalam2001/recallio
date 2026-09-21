import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsBoolean,
  IsOptional,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validador personalizado para política de contraseña segura.
 * Requiere: mínimo 8 chars, 1 mayúscula, 1 número, 1 caracter especial.
 */
@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (!password || password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return hasUppercase && hasNumber && hasSpecial;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (!@#$%^&*)';
  }
}

/**
 * Validador personalizado para confirmar que las contraseñas coincidan.
 */
@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const obj = args.object as RegisterDto;
    return obj.password === confirmPassword;
  }

  defaultMessage(): string {
    return 'Las contraseñas no coinciden';
  }
}

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  firstName!: string;

  @IsString({ message: 'El apellido paterno debe ser texto' })
  @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
  @MinLength(2, { message: 'El apellido paterno debe tener al menos 2 caracteres' })
  lastName!: string;

  @IsString({ message: 'El apellido materno debe ser texto' })
  @IsNotEmpty({ message: 'El apellido materno es obligatorio' })
  @MinLength(2, { message: 'El apellido materno debe tener al menos 2 caracteres' })
  motherLastName!: string;

  @IsString({ message: 'El nickname debe ser texto' })
  @IsNotEmpty({ message: 'El nickname es obligatorio' })
  @MinLength(3, { message: 'El nickname debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'El nickname no puede exceder 20 caracteres' })
  @Matches(/^[a-z0-9_]+$/, {
    message: 'El nickname solo puede contener letras minúsculas, números y guiones bajos',
  })
  nickname!: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Validate(IsStrongPasswordConstraint)
  password!: string;

  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria' })
  @Validate(PasswordMatchConstraint)
  confirmPassword!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
