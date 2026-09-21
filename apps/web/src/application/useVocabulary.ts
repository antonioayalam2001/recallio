import { useState, useCallback, useEffect } from 'react';
import { vocabularyRepository } from '../infrastructure/api/VocabularyRepository';
import { authRepository } from '../infrastructure/api/AuthRepository';
import type { Word, SuggestWordDto } from '../domain/models/vocabulary';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export const useVocabulary = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [currentUserRole, setCurrentUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    authRepository.me()
      .then(res => {
        setCurrentUserId(res.user.id);
        setCurrentUserRole(res.user.role);
      })
      .catch(() => {
        setCurrentUserId(undefined);
        setCurrentUserRole(undefined);
      });
  }, []);

  const fetchWords = useCallback(
    async (
      currentPage: number,
      search: string,
      isNewSearch = false,
      category = 'all',
      level = 'all',
      onlyMyDeck = false,
    ) => {
      setIsLoading(true);
      try {
        const response = await vocabularyRepository.getWords({
          page: currentPage,
          limit: 12,
          search: search || undefined,
          category: category !== 'all' ? category : undefined,
          level: level !== 'all' ? level : undefined,
          onlyMyDeck: onlyMyDeck || undefined,
        });

        setTotal(response.meta.total);
        setHasMore(response.meta.hasMore);

        if (isNewSearch) {
          setWords(response.data);
        } else {
          setWords((prev) => {
            const newWords = response.data.filter((nw) => !prev.some((pw) => pw.id === nw.id));
            return [...prev, ...newWords];
          });
        }
      } catch {
        toast.error('Error al cargar el vocabulario');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const suggestWord = async (data: SuggestWordDto, onSuccess: () => void) => {
    setIsSubmitting(true);
    try {
      await vocabularyRepository.suggestWord(data);
      toast.success('¡Palabra sugerida exitosamente! Pasará a revisión.');
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al sugerir la palabra');
      } else {
        toast.error('Error al sugerir la palabra');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSave = async (wordId: string) => {
    try {
      const res = await vocabularyRepository.toggleSave(wordId);
      if (res.saved) {
        toast.success('Añadido a Mi Diccionario');
      } else {
        toast.info('Removido de Mi Diccionario');
      }
      return res.saved;
    } catch {
      toast.error('Error al guardar la palabra');
      throw error;
    }
  };

  const deleteWord = async (id: string) => {
    try {
      await vocabularyRepository.deleteWord(id);
      setWords((prev) => prev.filter((w) => w.id !== id));
      toast.success('Palabra eliminada');
      return true;
    } catch {
      toast.error('No se pudo eliminar la palabra');
      return false;
    }
  };

  const updateWord = async (id: string, data: Partial<SuggestWordDto>, onSuccess: () => void) => {
    setIsSubmitting(true);
    try {
      await vocabularyRepository.updateWord(id, data);
      toast.success('Palabra actualizada correctamente');
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al actualizar la palabra');
      } else {
        toast.error('Error al actualizar la palabra');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestWordEdit = async (data: SuggestWordDto, onSuccess: () => void) => {
    setIsSubmitting(true);
    try {
      await vocabularyRepository.suggestWord({ ...data });
      toast.success('Sugerencia de cambio enviada para revisión del administrador');
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al enviar la sugerencia');
      } else {
        toast.error('Error al enviar la sugerencia');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    words,
    isLoading,
    isSubmitting,
    hasMore,
    page,
    total,
    currentUserId,
    currentUserRole,
    setPage,
    fetchWords,
    suggestWord,
    updateWord,
    suggestWordEdit,
    toggleSave,
    deleteWord,
  };
};
