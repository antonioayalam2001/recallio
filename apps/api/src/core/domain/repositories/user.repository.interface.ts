import { User } from '../entities/user.entity';

/**
 * Puerto de Dominio (Interfaz) que define las operaciones
 * necesarias para interactuar con la persistencia de Usuarios.
 *
 * @interface IUserRepository
 */
export interface IUserRepository {
  /**
   * Busca un usuario mediante su identificador único.
   *
   * @param {string} id - Identificador del usuario.
   * @returns {Promise<User | null>} La entidad User si es hallada, o null de lo contrario.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca un usuario mediante su correo electrónico.
   *
   * @param {string} email - Correo del usuario.
   * @returns {Promise<User | null>} La entidad User si es hallada, o null de lo contrario.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca un usuario mediante su nickname único.
   *
   * @param {string} nickname - Nickname del usuario.
   * @returns {Promise<User | null>} La entidad User si es hallada, o null de lo contrario.
   */
  findByNickname(nickname: string): Promise<User | null>;

  /**
   * Crea y guarda un nuevo usuario en la base de datos.
   *
   * @param {Omit<User, 'id' | 'createdAt'>} user - Datos del usuario a crear.
   * @returns {Promise<User>} El usuario recién creado con su ID y fechas.
   */
  create(user: Omit<User, 'id' | 'createdAt' | 'displayName' | 'fullName'>): Promise<User>;

  /**
   * Actualiza los datos de un usuario existente.
   *
   * @param {string} id - Identificador del usuario a actualizar.
   * @param {Partial<Pick<User, 'passwordHash' | 'avatarUrl'>>} data - Campos a actualizar.
   * @returns {Promise<User>} El usuario actualizado.
   */
  update(
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
  ): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
