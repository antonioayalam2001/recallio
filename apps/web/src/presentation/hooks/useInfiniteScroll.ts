import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** Si hay más páginas para cargar */
  hasMore: boolean;
  /** Si hay una carga en progreso (evita disparar múltiples peticiones) */
  isLoading: boolean;
  /** Si la lista tiene al menos un elemento (evita disparar con la lista vacía) */
  hasItems: boolean;
  /** Callback que se ejecuta cuando el centinela entra al viewport */
  onLoadMore: () => void;
  /** Proporción del centinela visible para disparar (default: 0.1 = 10%) */
  threshold?: number;
}

/**
 * Hook que encapsula el patrón IntersectionObserver para implementar
 * infinite scroll. Retorna una ref que se debe adjuntar al elemento
 * centinela al final de la lista.
 *
 * @example
 * const { sentinelRef } = useInfiniteScroll({
 *   hasMore,
 *   isLoading,
 *   hasItems: words.length > 0,
 *   onLoadMore: () => setPage(p => p + 1),
 * });
 *
 * // En el JSX:
 * <div ref={sentinelRef} className="h-10 w-full" />
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  hasItems,
  onLoadMore,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    },
    [onLoadMore]
  );

  useEffect(() => {
    if (!hasMore || isLoading || !hasItems) return;

    const observer = new IntersectionObserver(handleIntersect, { threshold });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, hasItems, handleIntersect, threshold]);

  return { sentinelRef };
}
