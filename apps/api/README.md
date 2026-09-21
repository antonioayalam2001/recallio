# Backend API (NestJS + Prisma)

Este proyecto maneja toda la lógica de negocio, autenticación JWT, moderación de palabras y sistema de partidas gamificadas utilizando **Arquitectura Hexagonal**.

## 🚀 Cómo ejecutar la API individualmente

1. Asegúrate de tener la base de datos corriendo (`docker compose up -d` desde la raíz).
2. Genera el cliente de Prisma si no lo has hecho:
   ```bash
   npx prisma generate
   ```
3. Inicia el servidor en modo desarrollo:
   ```bash
   pnpm dev
   # o bien:
   pnpm start:dev
   ```

## 📂 Arquitectura

Revisa el archivo `ARCHITECTURE.md` para entender la separación de capas (Domain, Application, Infrastructure).

## 📚 Librerías Principales Utilizadas

- **[@nestjs/core](https://nestjs.com/)**: Framework backend para Node.js basado en la inyección de dependencias.
- **[Prisma ORM (@prisma/client)](https://www.prisma.io/)**: Mapeo y consultas seguras a la base de datos PostgreSQL.
- **[@nestjs/jwt & passport-jwt](https://docs.nestjs.com/security/authentication)**: Emisión y validación de JSON Web Tokens.
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: Encriptación asimétrica y salting de contraseñas.
- **[class-validator & class-transformer](https://github.com/typestack/class-validator)**: Validación tipada de los DTOs en los controladores HTTP.
