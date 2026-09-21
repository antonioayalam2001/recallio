import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../../domain/services/password-hasher.interface';
import { ITokenService } from '../../domain/services/token.service.interface';
import { RegisterDto } from '../../../infrastructure/http/auth/dto/register.dto';
import { Role } from '@prisma/client';

/**
 * Caso de Uso que maneja el registro de un nuevo usuario en la aplicación.
 * Verifica unicidad de email y nickname, valida datos, y genera el JWT inicial.
 *
 * @class RegisterUseCase
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher) private readonly passwordHasher: IPasswordHasher,
    @Inject(ITokenService) private readonly tokenService: ITokenService,
  ) {}

  /**
   * Ejecuta la lógica de negocio para registrar a un nuevo usuario.
   *
   * @param {RegisterDto} dto - Datos de entrada provistos por el cliente.
   * @returns {Promise<{ accessToken: string }>} Objeto que contiene el JWT del nuevo usuario.
   * @throws {ConflictException} Si el email o nickname ya están registrados.
   */
  async execute(dto: RegisterDto): Promise<{ accessToken: string }> {
    // Verificar unicidad de email
    const existingByEmail = await this.userRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Verificar unicidad de nickname
    const existingByNickname = await this.userRepository.findByNickname(dto.nickname);
    if (existingByNickname) {
      throw new ConflictException('El nickname ya está en uso');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // Calcular el nombre completo
    const fullName = `${dto.firstName} ${dto.lastName} ${dto.motherLastName}`;

    const newUser = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      motherLastName: dto.motherLastName,
      name: fullName,
      nickname: dto.nickname.toLowerCase(),
      email: dto.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: Role.USER, // Por defecto todo registrado es USER. Los ADMIN se manejan por invitaciones.
      avatarUrl: null, // TODO: se activará con la integración de Localstack S3
    });

    const token = await this.tokenService.generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return { accessToken: token };
  }
}
