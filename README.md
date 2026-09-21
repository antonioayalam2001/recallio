# English Grammar & Vocabulary Monorepo

Aplicación de aprendizaje de vocabulario en inglés, diseñada con una arquitectura de monorepo gestionada por **pnpm workspaces**.
Incluye un backend en NestJS y un frontend en Astro con React.

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (Versión 22 recomendada)
- [pnpm](https://pnpm.io/) (Puedes activarlo con `corepack enable pnpm`)
- [Docker](https://www.docker.com/) (Para la base de datos PostgreSQL)

## 📦 Instalación y Configuración Base

1. **Instalar dependencias:**
   ```bash
   nvm use 22
   pnpm install
   ```
2. **Levantar la base de datos y pgAdmin:**
   ```bash
   docker compose up -d
   ```
3. **Configurar Prisma (Migraciones y Seed):**
   ```bash
   cd apps/api
   npx prisma migrate dev --name init
   npx prisma db seed
   cd ../..
   ```

## 🛠️ Comandos Globales

Desde la raíz del proyecto puedes ejecutar:

- `pnpm dev`: Inicia tanto el frontend como el backend simultáneamente.
- `pnpm lint`: Verifica la calidad del código con ESLint en todo el monorepo.
- `pnpm format`: Formatea el código con Prettier.
- `pnpm build`: Construye ambos proyectos para producción.

> **Nota:** Para acceder a pgAdmin y visualizar la base de datos, entra a [http://localhost:5050](http://localhost:5050). Credenciales: `admin@pgadmin.org` / `admin`.

---
