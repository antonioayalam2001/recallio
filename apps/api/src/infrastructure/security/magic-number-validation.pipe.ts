import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as fileType from 'file-type';

@Injectable()
export class MagicNumberValidationPipe implements PipeTransform<
  Express.Multer.File,
  Promise<Express.Multer.File>
> {
  async transform(value: Express.Multer.File): Promise<Express.Multer.File> {
    if (!value) {
      throw new BadRequestException('Archivo no proporcionado');
    }

    // Usar file-type para inspeccionar el "magic number" del buffer
    const typeInfo = await fileType.fromBuffer(value.buffer);

    if (!typeInfo) {
      throw new BadRequestException('Formato de archivo inválido o desconocido.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(typeInfo.mime)) {
      throw new BadRequestException(
        `El archivo debe ser una imagen válida (jpg, png, webp). Se detectó: ${typeInfo.mime}`,
      );
    }

    // Opcionalmente podemos reescribir el mimetype de multer para asegurar que coincide con la realidad
    value.mimetype = typeInfo.mime;

    return value;
  }
}
