# Clean Architecture en Astro y React (apps/web)

El frontend de esta aplicación gamificada sigue los principios de **Clean Architecture**, aislando la lógica de negocio, las APIs y la interfaz de usuario. En el contexto de Astro, React es nuestra capa de presentación para las "islas" interactivas.

## Capas

1. **Dominio (Domain):** Entidades (`Word`, `GameSession`, `User`) e interfaces que definen contratos para los repositorios.
2. **Infraestructura (Infrastructure):** La comunicación con el mundo exterior. Clientes HTTP (`fetch`), adaptadores de LocalStorage, servicios de audio (`WebAudioAPI`, `WebSpeechAPI`).
3. **Aplicación (Application):** Casos de uso de cliente y hooks personalizados. Es el pegamento. Aquí vive la lógica de gestión de estado global, puntajes, turnos, temporizadores, y llamadas a infraestructura.
4. **Presentación (Presentation):** Componentes React (visuales puros) e integraciones Astro. Reciben datos y emiten eventos a la capa de Aplicación.

## Estructura de Carpetas

```text
src/
├── domain/                   # Modelos, Tipos e Interfaces
│   ├── models/
│   └── repositories/
├── infrastructure/           # Llamadas a la API y APIs del navegador
│   ├── api/                  # ApiClient, ApiWordRepository
│   ├── audio/                # AudioSynthesizerService
│   └── storage/              # LocalStorageAdapter
├── application/              # Lógica orquestadora (Hooks y Store)
│   ├── useGame.ts
│   ├── useAuth.ts
│   ├── useVocabulary.ts
│   └── useAdmin.ts
├── presentation/             # UI Components (React)
│   ├── components/
│   │   ├── ui/               # Botones, Cards, Dialogs (shadcn base)
│   │   ├── game/             # GameArena, WordCard, TimerBar
│   │   ├── admin/            # AdminDashboard, WordModeration
│   │   └── common/           # Navbar, ThemeToggle
│   ├── layouts/              # Layout principal Astro
│   └── pages/                # Vistas principales (index, admin, vocabulary)
```

## Guía: ¿Cómo agregar una nueva funcionalidad/vista?

1. **Dominio:** Si es una nueva entidad (ej. `Badge`), crea `domain/models/Badge.ts` y si requiere guardar/obtener, define `IBadgeRepository`.
2. **Infraestructura:** Crea `infrastructure/api/ApiBadgeRepository.ts` implementando la interfaz.
3. **Aplicación:** Crea un hook orquestador (ej. `application/useBadges.ts`) que consuma el repositorio, procese los estados (`loading`, `error`) y exponga las funciones al UI.
4. **Presentación:** Diseña los componentes visuales en `presentation/components/badges/BadgeList.tsx` pasándoles la data a través de props o utilizando tu hook, y expónlo en una página en `src/pages/badges.astro`.
