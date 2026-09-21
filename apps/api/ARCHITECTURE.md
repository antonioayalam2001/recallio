# Arquitectura Hexagonal en NestJS (apps/api)

Este backend utiliza **Arquitectura Hexagonal** (también conocida como Puertos y Adaptadores) combinada con los módulos de NestJS.

## Principios Centrales

1. **Dominio (Domain):** Contiene la lógica central de negocio (entidades puras, value objects). El dominio no sabe NADA sobre bases de datos, HTTP o NestJS.
2. **Puertos (Ports):** Interfaces que definen cómo el dominio se comunica con el mundo exterior (ej. `IUserRepository`).
3. **Aplicación (Application):** Contiene los Casos de Uso. Un caso de uso orquesta el flujo de datos: recibe una petición, llama al repositorio para obtener una entidad, ejecuta la lógica de negocio y guarda el resultado.
4. **Adaptadores (Adapters / Infrastructure):** Implementan los puertos definidos en el dominio (ej. `PrismaUserRepository` implementa `IUserRepository`). Aquí es donde residen los Controladores HTTP (NestJS) y la integración con Prisma.

## Estructura de Carpetas

```text
src/
├── core/
│   ├── domain/               # Entidades, Value Objects, Interfaces (Ports)
│   └── application/          # Use Cases
├── infrastructure/           # Adaptadores concretos (Prisma, Controladores Nest, JWT)
│   ├── database/             # Repositorios concretos e integración con Prisma
│   ├── http/                 # Controladores y DTOs de entrada
│   └── security/             # Autenticación, Guards, Hasheo
└── modules/                  # Configuración de Módulos de NestJS (DI)
```

## Guía: ¿Cómo agregar un nuevo módulo o funcionalidad?

1. **Definir la Entidad y el Puerto:** Ve a `core/domain/entities` y define tu modelo puro. Luego crea la interfaz en `core/domain/repositories`.
2. **Crear el Caso de Uso:** Ve a `core/application/` y crea el servicio que implementa la lógica, inyectando el puerto mediante el token de inyección.
3. **Implementar el Adaptador:** Crea el repositorio en `infrastructure/database/` usando Prisma que implemente la interfaz del dominio.
4. **Exponer la API (Inbound):** Crea el DTO y el Controlador NestJS en `infrastructure/http/`.
5. **Configurar el Módulo:** Conecta la interfaz con la implementación en un módulo en `modules/` utilizando el sistema de providers de NestJS:
   ```typescript
   { provide: 'IUserRepository', useClass: PrismaUserRepository }
   ```
