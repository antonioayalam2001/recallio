import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Servicio centralizado para gestionar la conexión con Prisma ORM.
 * Extiende PrismaClient e implementa hooks de ciclo de vida de NestJS
 * para conectarse al iniciar la aplicación y desconectarse al cerrarla.
 *
 * @class PrismaService
 * @extends {PrismaClient}
 * @implements {OnModuleInit}
 * @implements {OnModuleDestroy}
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Se ejecuta automáticamente cuando el módulo es inicializado.
   * Establece la conexión con la base de datos PostgreSQL.
   *
   * @async
   * @returns {Promise<void>} Promesa vacía al completar la conexión.
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Conectando a la base de datos a través de Prisma...');
    await this.$connect();
    this.logger.log('¡Conexión a la base de datos establecida!');
  }

  /**
   * Se ejecuta automáticamente cuando la aplicación está a punto de cerrarse.
   * Desconecta limpiamente el cliente de Prisma para evitar fugas de memoria o conexiones.
   *
   * @async
   * @returns {Promise<void>} Promesa vacía al completar la desconexión.
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Cerrando conexión de Prisma...');
    await this.$disconnect();
  }
}
