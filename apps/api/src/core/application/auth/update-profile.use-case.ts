import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  motherLastName?: string;
  nickname?: string;
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(@Inject(IUserRepository) private readonly userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.nickname && dto.nickname !== user.nickname) {
      const existingNickname = await this.userRepository.findByNickname(dto.nickname);
      if (existingNickname) {
        throw new BadRequestException('El nickname ya está en uso');
      }
    }

    const firstName = dto.firstName ?? user.firstName;
    const lastName = dto.lastName ?? user.lastName;
    const motherLastName = dto.motherLastName ?? user.motherLastName;

    // Calculate the new full name
    const name = `${firstName} ${lastName} ${motherLastName}`.trim();

    return await this.userRepository.update(userId, {
      firstName,
      lastName,
      motherLastName,
      name,
      nickname: dto.nickname,
    });
  }
}
