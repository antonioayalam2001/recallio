import { useState, useEffect } from 'react';

/**
 * Hook genérico que retarda la actualización de un valor hasta que
 * haya transcurrido el tiempo de espera (delay) sin nuevos cambios.
 * Reemplaza el patrón manual de `setTimeout/clearTimeout` disperso en
 * VocabularyView, FlashcardCatalog y ProfileForm.
 *
 * @param value - El valor a debounce
 * @param delay - Milisegundos de espera (default: 300ms)
 * @returns El valor debounceado
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 350);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
