import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { S3StorageService } from '../../../infrastructure/adapters/s3-storage.service';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly s3StorageService: S3StorageService,
  ) {}

  async execute(userId: string, fileBuffer: Buffer, mimetype: string): Promise<string> {
    if (!fileBuffer || !mimetype) {
      throw new BadRequestException('Archivo no válido');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Subir la imagen a Floci S3
    const publicUrl = await this.s3StorageService.uploadAvatar(fileBuffer, mimetype, userId);

    // Actualizar el perfil del usuario en la base de datos
    // Necesitamos usar userRepository para actualizar avatarUrl.
    // user.updateAvatar(publicUrl); -> Asumiendo que el User domain model lo soporta
    // o simplemente actualizamos la DB.
    await this.userRepository.update(userId, { avatarUrl: publicUrl });

    return publicUrl;
  }
}
