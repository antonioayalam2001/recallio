import { Injectable } from '@nestjs/common';
import type { User as PrismaUser } from '@prisma/client';
import { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { User } from '../../../core/domain/entities/user.entity';
import { PrismaService } from '../prisma.service';

/**
 * Implementación concreta (Adaptador de Salida) de IUserRepository utilizando Prisma ORM.
 *
 * @class PrismaUserRepository
 * @implements {IUserRepository}
 */
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mapea un objeto retornado por Prisma al modelo de entidad de Dominio `User`.
   *
   * @param {PrismaUser} prismaModel - Registro directamente extraído de Prisma.
   * @returns {User} Entidad limpia del dominio.
   */
  private mapToDomain(prismaModel: PrismaUser): User {
    return new User(
      prismaModel.id,
      prismaModel.firstName,
      prismaModel.lastName,
      prismaModel.motherLastName,
      prismaModel.name,
      prismaModel.nickname,
      prismaModel.email,
      prismaModel.passwordHash,
      prismaModel.role,
      prismaModel.createdAt,
      prismaModel.avatarUrl,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { nickname } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'displayName' | 'fullName'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        motherLastName: user.motherLastName,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
    return this.mapToDomain(createdUser);
  }

  async update(
    id: string,
    data: Partial<
      Pick<
        User,
        | 'passwordHash'
        | 'avatarUrl'
        | 'firstName'
        | 'lastName'
        | 'motherLastName'
        | 'name'
        | 'nickname'
      >
    >,
  ): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.passwordHash !== undefined && { passwordHash: data.passwordHash }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.motherLastName !== undefined && { motherLastName: data.motherLastName }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.nickname !== undefined && { nickname: data.nickname }),
      },
    });
    return this.mapToDomain(updated);
  }
}
