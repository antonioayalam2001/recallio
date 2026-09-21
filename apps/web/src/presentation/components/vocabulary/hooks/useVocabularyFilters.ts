import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../infrastructure/api';
import { useVocabulary } from '../../../../application/useVocabulary';

interface UseVocabularyFiltersProps {
  fetchWords: ReturnType<typeof useVocabulary>['fetchWords'];
  setPage: ReturnType<typeof useVocabulary>['setPage'];
  page: number;
}

export function useVocabularyFilters({ fetchWords, setPage, page }: UseVocabularyFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [onlyMyDeck, setOnlyMyDeck] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [scrollY, setScrollY] = useState(0);

  // Debounce search (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load categories once
  useEffect(() => {
    api
      .get('/words/categories')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const categories = list.map((item: { category: string; count: number }) => item.category);
        setAvailableCategories(categories);
      })
      .catch(() => {
        // Fallback
        api
          .get('/words?status=APPROVED&limit=1000')
          .then((res) => {
            const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
            const categories = Array.from(
              new Set(list.map((w: Record<string, unknown>) => w.category))
            )
              .filter(Boolean)
              .sort() as string[];
            setAvailableCategories(categories);
          })
          .catch(() => {});
      });
  }, []);

  // Fetch words on filter change
  useEffect(() => {
    setPage(1);
    fetchWords(1, debouncedSearch, true, selectedCategory || 'all', 'all', onlyMyDeck);
  }, [debouncedSearch, selectedCategory, onlyMyDeck, fetchWords, setPage]);

  // Fetch more words on page change
  useEffect(() => {
    if (page > 1) {
      fetchWords(page, debouncedSearch, false, selectedCategory || 'all', 'all', onlyMyDeck);
    }
  }, [page, debouncedSearch, selectedCategory, onlyMyDeck, fetchWords]);

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Refetch utility
  const refetch = useCallback(() => {
    fetchWords(1, debouncedSearch, true, selectedCategory || 'all', 'all', onlyMyDeck);
  }, [fetchWords, debouncedSearch, selectedCategory, onlyMyDeck]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    selectedCategory,
    setSelectedCategory,
    onlyMyDeck,
    setOnlyMyDeck,
    availableCategories,
    setAvailableCategories,
    scrollY,
    refetch,
  };
}
