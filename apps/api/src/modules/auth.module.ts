import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../infrastructure/http/auth/auth.controller';
import { RegisterUseCase } from '../core/application/auth/register.use-case';
import { LoginUseCase } from '../core/application/auth/login.use-case';
import { ForgotPasswordUseCase } from '../core/application/auth/forgot-password.use-case';
import { ResetPasswordUseCase } from '../core/application/auth/reset-password.use-case';
import { UploadAvatarUseCase } from '../core/application/auth/upload-avatar.use-case';
import { UpdateProfileUseCase } from '../core/application/auth/update-profile.use-case';
import { PrismaUserRepository } from '../infrastructure/database/repositories/prisma-user.repository';
import { PrismaPasswordResetTokenRepository } from '../infrastructure/database/repositories/prisma-password-reset-token.repository';
import { BcryptPasswordHasher } from '../infrastructure/adapters/bcrypt-password-hasher';
import { JwtTokenService } from '../infrastructure/adapters/jwt-token.service';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { S3StorageService } from '../infrastructure/adapters/s3-storage.service';
import { IUserRepository } from '../core/domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../core/domain/services/password-hasher.interface';
import { ITokenService } from '../core/domain/services/token.service.interface';
import { IPasswordResetTokenRepository } from '../core/domain/repositories/password-reset-token.repository.interface';

/**
 * Módulo de Autenticación de NestJS que ensambla la Arquitectura Hexagonal.
 * Se encarga de proveer los casos de uso (Application) inyectándoles
 * sus adaptadores concretos (Infrastructure) utilizando tokens simbólicos (Interfaces).
 *
 * @class AuthModule
 */
@Module({
  imports: [
    JwtModule.register({
      global: true,
      // SECURITY: JWT_SECRET debe estar definido en .env. Sin fallback inseguro.
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Prisma y Adaptadores de Base de Datos
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IPasswordResetTokenRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
    // Adaptador de Cifrado de Contraseñas
    {
      provide: IPasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    // Adaptador de Tokens JWT
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
    // Servicios e Infraestructura Adicional
    S3StorageService,
    // Casos de Uso
    RegisterUseCase,
    LoginUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    UploadAvatarUseCase,
    UpdateProfileUseCase,
  ],
  exports: [ITokenService, IUserRepository, IPasswordHasher],
})
export class AuthModule {}
