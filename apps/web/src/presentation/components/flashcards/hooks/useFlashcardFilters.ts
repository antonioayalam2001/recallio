import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { flashcardRepository } from '../../../../infrastructure/api/FlashcardRepository';
import type { Flashcard } from '../../../../domain/models/flashcard';

interface UseFlashcardFiltersProps {
  fetchFlashcards: (
    page: number,
    search: string,
    groupId: string,
    topicId: string,
    categoryId: string,
    isNew: boolean,
    onlyMyDeck: boolean
  ) => Promise<void>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export const useFlashcardFilters = ({ fetchFlashcards, setPage }: UseFlashcardFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [onlyMyDeck, setOnlyMyDeck] = useState(false);

  const [isStudying, setIsStudying] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [isPreparingStudy, setIsPreparingStudy] = useState(false);

  // Debounce para búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Refetch cuando cambian los filtros
  useEffect(() => {
    if (setPage) setPage(1);
    fetchFlashcards(
      1,
      debouncedSearch,
      selectedGroupId,
      selectedTopicId,
      selectedCategoryId,
      true,
      onlyMyDeck
    );
  }, [
    debouncedSearch,
    selectedGroupId,
    selectedTopicId,
    selectedCategoryId,
    onlyMyDeck,
    fetchFlashcards,
    setPage,
  ]);

  const startStudySession = async () => {
    setIsPreparingStudy(true);
    try {
      const response = await flashcardRepository.getFlashcards({
        limit: 50,
        search: debouncedSearch || undefined,
        groupId: selectedGroupId || undefined,
        topicId: selectedTopicId || undefined,
        categoryId: selectedCategoryId || undefined,
        status: 'APPROVED',
        onlyMyDeck: onlyMyDeck || undefined,
        forStudy: true,
      });

      if (response.data.length === 0) {
        toast.info('No hay tarjetas pendientes de repaso para estos filtros en este momento.');
        return;
      }

      setStudyCards(response.data);
      setIsStudying(true);
    } catch {
      toast.error('Error al iniciar el modo estudio');
    } finally {
      setIsPreparingStudy(false);
    }
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedGroupId || selectedTopicId || selectedCategoryId
  );

  const activeFiltersCount = [
    Boolean(searchTerm.trim()),
    Boolean(selectedGroupId),
    Boolean(selectedTopicId),
    Boolean(selectedCategoryId),
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGroupId('');
    setSelectedTopicId('');
    setSelectedCategoryId('');
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    selectedGroupId,
    setSelectedGroupId,
    selectedTopicId,
    setSelectedTopicId,
    selectedCategoryId,
    setSelectedCategoryId,
    onlyMyDeck,
    setOnlyMyDeck,
    isStudying,
    setIsStudying,
    studyCards,
    isPreparingStudy,
    startStudySession,
    hasActiveFilters,
    activeFiltersCount,
    handleClearFilters,
  };
};
