# Frontend (Astro + React)

Este proyecto maneja la interfaz de usuario con interactividad gamificada, modo claro/oscuro (rosa pastel), y el panel de administración siguiendo una **Clean Architecture**.

## 🚀 Cómo ejecutar el Frontend individualmente

1. Instala las dependencias si no lo has hecho desde la raíz (`pnpm install`).
2. Inicia el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
3. Abre tu navegador en [http://localhost:4321](http://localhost:4321).

## 📂 Arquitectura

Revisa el archivo `ARCHITECTURE.md` para entender la separación de capas (Domain, Infrastructure, Application, Presentation).

## 📚 Librerías Principales Utilizadas

- **[Astro](https://astro.build/)**: Framework web optimizado para velocidad, entregando HTML estático con hidratación parcial (Astro Islands).
- **[React](https://react.dev/)**: Librería para los componentes UI altamente interactivos (como el tablero de juego).
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework utilitario para estilos responsivos y el sistema de Modo Claro/Oscuro (Rosa Pastel).
- **[Framer Motion](https://www.framer.com/motion/)**: Librería para orquestar animaciones complejas (Pop Layouts, animaciones de cristal roto).
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)**: Sistema de partículas de alto rendimiento utilizado para celebrar aciertos.
- **[lucide-react](https://lucide.dev/)**: Colección de íconos vectoriales modernos y consistentes.
