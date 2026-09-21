# 🛠️ Plan de Refactorización — Capa de Presentación

> **Objetivo**: Disminuir la complejidad de los componentes actuales mediante la segregación en subcomponentes atómicos y la extracción de lógica hacia custom hooks, siguiendo la arquitectura Clean / Component-Driven del proyecto.

---

## 🏛️ Arquitectura de referencia

```
src/
├── application/          ← Hooks de dominio (useGame, useVocabulary, ...)
├── presentation/
│   ├── constants/        ← [NUEVO] Constantes compartidas entre features
│   ├── hooks/            ← [NUEVO] Hooks genéricos de UI (useDebounce, useInfiniteScroll)
│   └── components/
│       ├── game/
│       │   ├── hooks/    ← [NUEVO] Custom hooks específicos de UI del feature
│       │   └── ...
│       ├── vocabulary/
│       │   ├── hooks/    ← [NUEVO]
│       │   └── schemas/  ← [NUEVO]
│       ├── admin/
│       │   └── hooks/    ← [NUEVO]
│       ├── flashcards/
│       │   └── hooks/    ← [NUEVO]
│       ├── common/       ← Átomos transversales (actualmente vacío, ampliar)
│       └── ui/           ← Átomos reutilizables (ya existe, ampliar)
```

> **Regla**: Los hooks en `application/` orquestan lógica de dominio; los hooks en `presentation/.../hooks/` orquestan estado de UI local (filtros, modals, selección, debounce, etc.).

---

## 📋 Tabla de Refactorización

### 🎮 Módulo: `game/`

| # | Archivo | Refactorización Necesaria | Nuevo Archivo | Estado |
|---|---------|--------------------------|---------------|--------|
| G1 | `GameArena.tsx` (570 líneas) | Extraer todo el estado y lógica del lobby (categorías, nivel, preguntas disponibles, `startGame`) a un hook dedicado | `game/hooks/useGameLobby.ts` | [x] |
| G2 | `GameArena.tsx` | Extraer el bloque JSX del selector de niveles en un componente atómico | `game/LevelSelector.tsx` | [x] |
| G3 | `GameArena.tsx` | Extraer el bloque JSX del multi-select de categorías (etiquetas, botones de acción, spinner) en un componente | `game/CategorySelector.tsx` | [x] |
| G4 | `GameArena.tsx` | Extraer el bloque JSX del selector de cantidad de preguntas (adaptativo: fijo / opciones / mensaje insuficiente) | `game/QuestionCountSelector.tsx` | [x] |
| G5 | `GameArena.tsx` | Extraer el panel "pool de palabras disponibles" (Sparkles + contador) en un componente | `game/WordPoolStatus.tsx` | [x] |
| G6 | `GameArena.tsx` | Extraer la vista completa del lobby (usa G2–G5) dejando `GameArena` como orquestador de fases | `game/GameLobby.tsx` | [x] |
| G7 | `GameArena.tsx` | Extraer la lógica del juego en progreso (selectedId, isShattered, answeredQuestionId, onOptionClick, playAudio, efecto de cambio de pregunta) a un hook | `game/hooks/useGamePlay.ts` | [x] |
| G8 | `GameArena.tsx` | Extraer la vista de "fase playing" (barra score + opciones + audio) en un componente | `game/GameBoard.tsx` | [x] |
| G9 | `GameArena.tsx` | Extraer la vista de "fase loading" en un componente simple | `game/GameLoadingScreen.tsx` | [x] |
| G10 | `GameArena.tsx` | Eliminar comentarios `eslint-disable-next-line react-hooks/set-state-in-effect` al refactorizar efectos hacia `useGamePlay.ts` | `GameArena.tsx` (limpieza) | [x] |
| G11 | `MatchSummary.tsx` (245 líneas) | Extraer `CustomTooltipPie` y `CustomTooltipBar` como componentes separados (actualmente son funciones anónimas dentro del módulo) | `game/MatchSummaryTooltips.tsx` | [x] |
| G12 | `MatchSummary.tsx` | Extraer la sección de gráfica Pie en un subcomponente | `game/ScorePieChart.tsx` | [x] |
| G13 | `MatchSummary.tsx` | Extraer la sección de gráfica Bar (tiempo de respuesta) en un subcomponente | `game/ResponseTimeBarChart.tsx` | [x] |

---

### 📚 Módulo: `vocabulary/`

| # | Archivo | Refactorización Necesaria | Nuevo Archivo | Estado |
|---|---------|--------------------------|---------------|--------|
| V1 | `VocabularyView.tsx` (709 líneas) | Extraer todo el estado de filtros, debounce de búsqueda, carga de categorías, infinite scroll (IntersectionObserver), scroll parallax y manejo de bookmarks/removedIds a un hook | `vocabulary/hooks/useVocabularyFilters.ts` | [x] |
| V2 | `VocabularyView.tsx` | Extraer el schema Zod `wordSchema` y tipo `WordFormValues` a un archivo de validación | `vocabulary/schemas/wordSchema.ts` | [x] |
| V3 | `VocabularyView.tsx` | Extraer la lógica del formulario de sugerencia (useForm + onSubmit + handlers) a un hook | `vocabulary/hooks/useSuggestWordForm.ts` | [x] |
| V4 | `VocabularyView.tsx` | Extraer el panel de búsqueda + filtros (Search input, Select categoría, tabs Pública/Mi Mazo) en un componente | `vocabulary/VocabularyFilterBar.tsx` | [x] |
| V5 | `VocabularyView.tsx` | Extraer la tarjeta de palabra (badges nivel/categoría, audio, menú, título, ejemplo) — actualmente JSX anónimo dentro del `.map()` — en un componente | `vocabulary/VocabularyWordCard.tsx` | [x] |
| V6 | `VocabularyView.tsx` | Extraer los skeletons de infinite scroll en un componente reutilizable | `vocabulary/VocabularyCardSkeleton.tsx` | [x] |
| V7 | `VocabularyView.tsx` | Extraer el formulario de sugerencia (campo a campo) que vive dentro del `AdaptiveSheet` en un componente | `vocabulary/SuggestWordForm.tsx` | [x] |
| V8 | `VocabularyView.tsx` | Extraer el Dialog de confirmación de eliminación (lógica de título/descripción por tipo de palabra) en un componente | `vocabulary/DeleteWordDialog.tsx` | [x] |
| V9 | `VocabularyView.tsx` | Mover constante `LEVEL_COLORS` a un archivo de constantes compartidas (actualmente duplicada en otros archivos) | `presentation/constants/levels.ts` | [x] |
| V10 | `VocabularyView.tsx` | Eliminar la llamada directa a `api.get('/words/categories')` dentro del componente; moverla al hook `useVocabularyFilters` | `vocabulary/hooks/useVocabularyFilters.ts` | [x] |

---

### 🃏 Módulo: `flashcards/`

| # | Archivo | Refactorización Necesaria | Nuevo Archivo | Estado |
|---|---------|--------------------------|---------------|--------|
| F1 | `FlashcardCatalog.tsx` (550 líneas) | Extraer el estado y lógica de filtros, debounce, sesión de estudio (`startStudySession`, `hasActiveFilters`, `handleClearFilters`) a un hook | `flashcards/hooks/useFlashcardFilters.ts` | [x] |
| F2 | `FlashcardCatalog.tsx` | Extraer `FlashcardItem` (definido en el mismo archivo con su propio estado `isFlipped`) a su propio archivo | `flashcards/FlashcardItem.tsx` | [x] |
| F3 | `FlashcardCatalog.tsx` | Extraer el panel de búsqueda y filtros (search, selects de grupo/tema/categoría, tabs Mi Mazo) en un componente | `flashcards/FlashcardFilterBar.tsx` | [x] |
| F4 | `FlashcardCatalog.tsx` | Extraer el Dialog de confirmación de eliminación de flashcard en un componente | `flashcards/DeleteFlashcardDialog.tsx` | [x] |
| F5 | `CreateFlashcardModal.tsx` (314 líneas) | Extraer la lógica del formulario (useForm, handlers de grupo/tema/categoría en cascada) a un hook | `flashcards/hooks/useCreateFlashcardForm.ts` | [x] |
| F6 | `CreateFlashcardModal.tsx` | Extraer el componente tab Write/Preview de markdown (usado en front y back) a un átomo reutilizable | `ui/MarkdownEditor.tsx` | [x] |
| F7 | `EditFlashcardModal.tsx` (360 líneas) | Extraer la lógica del formulario de edición (useForm, precarga con useEffect, modo directo vs. sugerencia) a un hook | `flashcards/hooks/useEditFlashcardForm.ts` | [x] |
| F8 | `EditFlashcardModal.tsx` | Reutilizar el componente `MarkdownEditor` de F6 en lugar de duplicar el JSX del tab Write/Preview | `ui/MarkdownEditor.tsx` (mismo que F6) | [x] |

---

### 🛡️ Módulo: `admin/`

| # | Archivo | Refactorización Necesaria | Nuevo Archivo | Estado |
|---|---------|--------------------------|---------------|--------|
| A1 | `AdminDashboard.tsx` (484 líneas) | Extraer el schema Zod `inviteSchema` y la lógica del formulario de invitación (useForm + onGenerateInvite) a un hook | `admin/hooks/useInviteForm.ts` | [x] |
| A2 | `AdminDashboard.tsx` | Extraer la vista completa de "Moderación de Palabras" (lista + comparación + botones) en un componente | `admin/PendingWordsTab.tsx` | [x] |
| A3 | `AdminDashboard.tsx` | Extraer la vista de "Moderación de Flashcards" (lista + comparación anverso/reverso + botones) en un componente | `admin/PendingFlashcardsTab.tsx` | [x] |
| A4 | `AdminDashboard.tsx` | Extraer la vista de "Invitaciones Admin" (formulario + token generado con copy) en un componente | `admin/AdminInviteTab.tsx` | [x] |
| A5 | `AdminDashboard.tsx` | Extraer los tres botones de navegación de tabs en un componente | `admin/AdminTabNav.tsx` | [x] |
| A6 | `AdminDashboard.tsx` | Extraer el bloque de comparación "Original vs Propuesta" de palabras (grid 2 col) en un componente reutilizable | `admin/WordComparisonCard.tsx` | [x] |
| A7 | `AdminDashboard.tsx` | Extraer el bloque de comparación "Original vs Propuesta" de flashcards en un componente reutilizable | `admin/FlashcardComparisonCard.tsx` | [x] |

---

### 👤 Módulo: `profile/`

| # | Archivo | Refactorización Necesaria | Nuevo Archivo | Estado |
|---|---------|--------------------------|---------------|--------|
| P1 | `ProfileForm.tsx` (239 líneas) | Extraer el schema Zod `profileSchema` y tipo a un archivo de validación | `profile/schemas/profileSchema.ts` | [x] |
| P2 | `ProfileForm.tsx` | Extraer la lógica de debounce de nickname y verificación de disponibilidad (con estado `nicknameStatus`) a un hook | `profile/hooks/useNicknameCheck.ts` | [x] |

---

### 🧩 Módulo: `ui/` y shared (Átomos compartidos)

| # | Archivo | Refactorización Necesaria | Nuevo Archivo | Estado |
|---|---------|--------------------------|---------------|--------|
| U1 | *(no existe)* | Crear componente `MarkdownEditor` con tabs Write/Preview reutilizable en `CreateFlashcardModal` y `EditFlashcardModal` | `ui/MarkdownEditor.tsx` | [x] |
| U2 | *(no existe)* | Crear componente `ConfirmDeleteDialog` genérico (título, descripción, callback) para reemplazar dialogs de confirmación duplicados en `VocabularyView`, `FlashcardCatalog`, etc. | `ui/ConfirmDeleteDialog.tsx` | [x] |
| U3 | *(no existe)* | Crear constantes compartidas `LEVEL_COLORS` y `LEVEL_OPTIONS` para evitar duplicación entre `VocabularyView`, `GameArena` y `EditWordModal` | `presentation/constants/levels.ts` | [x] |
| U4 | *(no existe)* | Crear hook `useDebounce` genérico que encapsule el patrón `setTimeout/clearTimeout` repetido en `VocabularyView`, `FlashcardCatalog` y `ProfileForm` | `presentation/hooks/useDebounce.ts` | [x] |
| U5 | *(no existe)* | Crear hook `useInfiniteScroll` que encapsule el `IntersectionObserver` de `VocabularyView` | `presentation/hooks/useInfiniteScroll.ts` | [x] |

---

## ⚠️ Discrepancias detectadas con la arquitectura

1. **Llamadas a `api` directamente en componentes**: `VocabularyView.tsx` llama a `/words/categories` y `GameArena.tsx` llama a `/game/generate` y `/game/submit` directamente mediante el cliente `api`. Deberían residir en un repositorio de infraestructura o en el hook de aplicación, no en el componente.

2. **Schemas Zod en el cuerpo del archivo de componente**: `wordSchema`, `flashcardSchema`, `inviteSchema`, `profileSchema`, etc. están definidos al inicio del módulo del componente. Deberían estar en archivos de validación propios (carpeta `schemas/`) o ser importados por el hook que los consume.

3. **`FlashcardItem` colocado en `FlashcardCatalog.tsx`**: Un subcomponente con su propio estado reactivo (`isFlipped`, `isBookmarked`) está definido dentro del módulo de su componente padre. Por convención y mantenibilidad, debe ser un archivo independiente.

4. **`common/` vacío**: El directorio `presentation/components/common/` existe pero está vacío. Los átomos transversales como `ConfirmDeleteDialog`, `MarkdownEditor` o futuros `LevelBadge` deberían ubicarse ahí en lugar de `ui/`, que actualmente mezcla componentes de shadcn con componentes propios.

5. **Comentarios `eslint-disable` como parche de arquitectura**: Los `// eslint-disable-next-line react-hooks/set-state-in-effect` en `GameArena.tsx` son síntoma de que el `setState` debería estar en un handler o dentro de un hook propio, no en un `useEffect` directo. Al extraer `useGameLobby` y `useGamePlay` este problema desaparece estructuralmente.

---

## 📌 Orden de ejecución sugerido

Se recomienda abordar en este orden para minimizar riesgos de regresión:

1. **Infraestructura compartida** (U1–U5): hooks y componentes genéricos que otros módulos usarán.
2. **Game** (G1–G13): módulo con mayor densidad de lógica mezclada y los `eslint-disable` a eliminar.
3. **Vocabulary** (V1–V10): módulo más grande en líneas (709).
4. **Flashcards** (F1–F8): mayor número de archivos involucrados.
5. **Admin** (A1–A7): lógica más autocontenida.
6. **Profile** (P1–P2): menor impacto.
