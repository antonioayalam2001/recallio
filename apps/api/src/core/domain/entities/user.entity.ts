import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

/**
 * Entidad de Dominio que representa a un usuario dentro del sistema.
 * Es agnóstica de frameworks o bases de datos.
 *
 * @class User
 */
export class User {
  @Exclude()
  public readonly passwordHash: string;

  /**
   * Crea una nueva instancia de la entidad User.
   *
   * @param {string} id - Identificador único universal del usuario (UUID).
   * @param {string} firstName - Nombre(s) del usuario.
   * @param {string} lastName - Apellido paterno del usuario.
   * @param {string} motherLastName - Apellido materno del usuario.
   * @param {string} name - Nombre completo calculado (firstName + lastName + motherLastName).
   * @param {string} nickname - Apodo único del usuario, alfanumérico 3-20 chars.
   * @param {string} email - Correo electrónico, utilizado para login y contacto.
   * @param {string} passwordHash - Hash seguro de la contraseña.
   * @param {Role} role - Rol asignado en el sistema (USER, ADMIN).
   * @param {Date} createdAt - Fecha en la que el usuario fue registrado.
   * @param {string | null} avatarUrl - URL de la foto de perfil (TODO: pendiente de Localstack S3).
   */
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly motherLastName: string,
    public readonly name: string,
    public readonly nickname: string,
    public readonly email: string,
    passwordHash: string,
    public readonly role: Role,
    public readonly createdAt: Date,
    // TODO: avatarUrl se activará cuando la arquitectura de Localstack S3 esté lista
    public readonly avatarUrl: string | null = null,
  ) {
    this.passwordHash = passwordHash;
  }

  /**
   * Retorna el nombre de pantalla principal del usuario (nickname).
   */
  get displayName(): string {
    return this.nickname;
  }

  /**
   * Retorna el nombre completo concatenado del usuario.
   */
  get fullName(): string {
    return this.name;
  }
}
