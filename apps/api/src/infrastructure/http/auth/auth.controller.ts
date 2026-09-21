import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterUseCase } from '../../../core/application/auth/register.use-case';
import { LoginUseCase } from '../../../core/application/auth/login.use-case';
import { ForgotPasswordUseCase } from '../../../core/application/auth/forgot-password.use-case';
import { ResetPasswordUseCase } from '../../../core/application/auth/reset-password.use-case';
import { UploadAvatarUseCase } from '../../../core/application/auth/upload-avatar.use-case';
import { UpdateProfileUseCase } from '../../../core/application/auth/update-profile.use-case';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { CurrentUser } from '../../security/current-user.decorator';
import { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { MagicNumberValidationPipe } from '../../security/magic-number-validation.pipe';

// TODO: Agregar rate limiting con @nestjs/throttler en los endpoints de auth
// para prevenir ataques de fuerza bruta (especialmente en /login y /forgot-password).
// Ejemplo: @Throttle({ default: { limit: 5, ttl: 60000 } })

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  private setAuthCookie(res: Response, token: string, rememberMe: boolean = false): void {
    // 3 días en milisegundos si rememberMe está activo
    const maxAge = rememberMe ? 3 * 24 * 60 * 60 * 1000 : undefined;

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.registerUseCase.execute(dto);
    this.setAuthCookie(res, accessToken, dto.rememberMe);
    return { success: true, message: 'Registrado correctamente' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.loginUseCase.execute(dto);
    this.setAuthCookie(res, accessToken, dto.rememberMe);
    return { success: true, message: 'Sesión iniciada' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { success: true, message: 'Sesión cerrada' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    const fullUser = await this.userRepository.findById(user.userId);
    if (!fullUser) {
      return { user: { id: user.userId, email: user.email, role: user.role } };
    }
    return {
      user: {
        id: fullUser.id,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        motherLastName: fullUser.motherLastName,
        name: fullUser.name,
        nickname: fullUser.nickname,
        email: fullUser.email,
        role: fullUser.role,
        avatarUrl: fullUser.avatarUrl,
        createdAt: fullUser.createdAt,
      },
    };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    const updatedUser = await this.updateProfileUseCase.execute(user.userId, dto);
    return {
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        motherLastName: updatedUser.motherLastName,
        name: updatedUser.name,
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
      },
    };
  }

  /**
   * Verifica en tiempo real si un nickname está disponible.
   * Usado por el formulario de registro con debounce.
   *
   * GET /auth/check-nickname?value=juan_92
   */
  @Get('check-nickname')
  async checkNickname(@Query('value') value: string) {
    if (!value || value.length < 3) {
      throw new BadRequestException('El nickname debe tener al menos 3 caracteres');
    }
    const existing = await this.userRepository.findByNickname(value.toLowerCase());
    return { available: !existing };
  }

  /**
   * Solicita el envío de un email de recuperación de contraseña.
   * Siempre retorna el mismo mensaje para no revelar si el email existe.
   *
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.forgotPasswordUseCase.execute(dto.email);
  }

  /**
   * Restablece la contraseña usando un token válido y no expirado.
   *
   * POST /auth/reset-password
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.resetPasswordUseCase.execute(dto);
  }

  /**
   * Sube o actualiza la foto de perfil (avatar) del usuario actual.
   * La imagen se valida para asegurar que sea de tipo imagen y menor a 5MB.
   *
   * PUT /auth/me/avatar
   */
  @Put('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
      MagicNumberValidationPipe,
    )
    file: Express.Multer.File,
  ) {
    const avatarUrl = await this.uploadAvatarUseCase.execute(
      user.userId,
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      message: 'Avatar subido exitosamente',
      avatarUrl,
    };
  }
}
