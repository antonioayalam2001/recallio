import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

/**
 * Valida que las variables de entorno críticas estén definidas antes de iniciar.
 * Si falta alguna, la aplicación lanza un error y no arranca.
 */
function validateEnvironment(): void {
  const required = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Variables de entorno faltantes: ${missing.join(', ')}. ` +
        `Revisa tu archivo .env antes de iniciar el servidor.`,
    );
  }

  // Advertencia si JWT_SECRET es demasiado corto (menos de 32 chars)
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      '⚠️  ADVERTENCIA: JWT_SECRET tiene menos de 32 caracteres. Se recomienda usar al menos 32 chars para mayor seguridad.',
    );
  }
}

async function bootstrap(): Promise<void> {
  validateEnvironment();

  const app = await NestFactory.create(AppModule);

  // CORS: Solo permite el origen del frontend con credenciales (cookies)
  app.enableCors({
    origin: ['http://localhost:4321', 'http://127.0.0.1:4321'],
    credentials: true,
  });

  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor backend iniciado en: http://localhost:${port}`);
}

bootstrap();
