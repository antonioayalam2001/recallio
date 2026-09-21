# Configuración de Floci (Simulador Local de AWS) para Avatares de Usuario

Este documento describe el paso a paso para configurar **Floci** (https://floci.io/) como un simulador local de AWS S3, necesario para habilitar la subida y almacenamiento de fotos de perfil (avatares) en la aplicación sin incurrir en costos de la nube.

Floci es un emulador de AWS ligero y gratuito (escrito nativamente en Go/Java) que reemplaza herramientas pesadas como LocalStack, y funciona en el mismo puerto estándar (4566).

---

## 1. Prerrequisitos

- **Docker** y **Docker Compose** instalados y corriendo.
- **AWS CLI** configurado localmente.
- Una aplicación NestJS configurada para leer variables de entorno.

---

## 2. Iniciar Floci

Floci ya se encuentra ejecutándose de forma global en tu máquina en el puerto `4566`. 
Si alguna vez se detiene, puedes iniciarlo usando el CLI oficial de Floci:

```bash
floci start
```

Opcionalmente, puedes configurar tu entorno en la terminal usando `eval $(floci env)`.

---

## 3. Crear el Bucket S3 Local

Una vez que Floci esté corriendo, utiliza el AWS CLI para crear el bucket `user-avatars`. Como estamos usando Floci localmente, debemos apuntar al endpoint `http://localhost:4566`.

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://user-avatars
```

Verifica que el bucket fue creado exitosamente:
```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

*(Opcionalmente, puedes abrir el panel de control de Floci en tu navegador web en `http://localhost:4566/_floci/ui` para ver visualmente tus buckets).*

---

## 4. Configurar Permisos y CORS del Bucket

Para que el frontend pueda leer y renderizar las imágenes de forma directa, el bucket debe permitir peticiones CORS desde el frontend (`http://localhost:4321`).

Crea un archivo temporal `cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

Aplica el CORS al bucket en Floci:
```bash
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket user-avatars --cors-configuration file://cors.json
```

---

## 5. Variables de Entorno en el Backend (`.env`)

Añade las siguientes variables a tu archivo `apps/api/.env`:

```env
# AWS / Floci S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_ENDPOINT=http://localhost:4566
AWS_S3_AVATAR_BUCKET=user-avatars
```
*(Nota: Floci acepta cualquier credencial no vacía, `test`/`test` es un estándar convencional).*

---

## 6. Instalación de Dependencias Backend (S3)

En la carpeta del backend (`apps/api`), debes instalar el SDK de S3 y multer (para procesar el FormData):

```bash
cd apps/api
npm install @aws-sdk/client-s3 @nestjs/platform-express multer
npm install -D @types/multer
```
