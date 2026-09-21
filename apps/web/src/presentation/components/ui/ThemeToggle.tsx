import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Componente interactivo para alternar manualmente entre Modo Claro y Modo Oscuro.
 * Persiste la preferencia en localStorage y sincroniza la clase 'dark' en el elemento raíz (<html>).
 *
 * @component ThemeToggle
 */
export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detectar tema actual desde la clase del elemento raíz o localStorage
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-full hover:bg-foreground/10 text-foreground/70 hover:text-primary transition-all duration-200 border border-transparent hover:border-foreground/10 focus:outline-none"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label="Alternar tema de color"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};
