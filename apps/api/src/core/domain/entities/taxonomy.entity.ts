/**
 * Entidad de dominio que representa un Tema (Topic) general de estudio.
 * Ejemplo: Programación, Inglés, Ciencia.
 *
 * @class TopicEntity
 */
export class GroupEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string | null,
    public readonly createdAt?: Date,
  ) {}
}

/**
 * Entidad de dominio que representa un Tema (Topic) general de estudio dentro de un Grupo.
 * Ejemplo: Present Times, React, Astronomía.
 *
 * @class TopicEntity
 */
export class TopicEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly groupId: string,
    public readonly description?: string | null,
    public readonly createdAt?: Date,
  ) {}
}

/**
 * Entidad de dominio que representa una Categoría dentro de un Tema específico.
 * Ejemplo: TypeScript, Phrasal Verbs, Astronomía.
 *
 * @class CategoryEntity
 */
export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly topicId: string,
    public readonly createdAt?: Date,
  ) {}
}
