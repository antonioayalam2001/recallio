import { useState, useCallback, useEffect } from 'react';
import { flashcardRepository } from '../infrastructure/api/FlashcardRepository';
import { authRepository } from '../infrastructure/api/AuthRepository';
import type { Flashcard, Group, CreateFlashcardDto } from '../domain/models/flashcard';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export const useFlashcards = () => {
  const [taxonomies, setTaxonomies] = useState<Group[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    authRepository.me()
      .then(res => {
        setCurrentUserId(res.user.id);
        setCurrentUserRole(res.user.role);
      })
      .catch(() => {
        setCurrentUserId(null);
        setCurrentUserRole(null);
      });
  }, []);

  const loadTaxonomies = useCallback(async () => {
    try {
      const data = await flashcardRepository.getTaxonomies();
      setTaxonomies(data);
    } catch {
      toast.error('Error al cargar taxonomías');
    }
  }, []);

  const fetchFlashcards = useCallback(
    async (
      currentPage: number,
      search: string,
      groupId: string,
      topicId: string,
      categoryId: string,
      isNewSearch = false,
      onlyMyDeck = false,
      forStudy = false,
    ) => {
      setIsLoading(true);
      try {
        const response = await flashcardRepository.getFlashcards({
          page: currentPage,
          limit: 12,
          search: search || undefined,
          groupId: groupId || undefined,
          topicId: topicId || undefined,
          categoryId: categoryId || undefined,
          status: onlyMyDeck ? undefined : 'APPROVED',
          onlyMyDeck: onlyMyDeck || undefined,
          forStudy: forStudy || undefined,
        });

        setTotal(response.meta?.total || response.data.length);
        setHasMore(response.meta?.hasMore || false);

        if (isNewSearch) {
          setFlashcards(response.data);
        } else {
          setFlashcards((prev) => {
            const newCards = response.data.filter((nc) => !prev.some((pc) => pc.id === nc.id));
            return [...prev, ...newCards];
          });
        }
      } catch {
        toast.error('Error al cargar flashcards');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createFlashcard = async (data: CreateFlashcardDto, onSuccess: () => void) => {
    try {
      await flashcardRepository.createFlashcard(data);
      toast.success('¡Flashcard creada! Si eres usuario regular, pasará a revisión.');
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al crear la flashcard');
      } else {
        toast.error('Error al crear la flashcard');
      }
    }
  };

  const submitStudySession = async (data: Record<string, unknown>) => {
    try {
      await flashcardRepository.submitStudySession(data);
    } catch {
      console.error('Error al guardar sesión de estudio:', error);
    }
  };

  const toggleSave = async (flashcardId: string) => {
    try {
      const res = await flashcardRepository.toggleSave(flashcardId);
      if (res.saved) {
        toast.success('Añadido a Mi Mazo');
      } else {
        toast.info('Removido de Mi Mazo');
      }
      return res.saved;
    } catch {
      toast.error('Error al guardar la flashcard');
      throw error;
    }
  };

  const reviewFlashcard = async (flashcardId: string, quality: number) => {
    try {
      await flashcardRepository.reviewFlashcard(flashcardId, quality);
    } catch {
      console.error('Error al registrar review:', error);
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      await flashcardRepository.deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((f) => f.id !== id));
      toast.success('Tarjeta eliminada');
      return true;
    } catch {
      toast.error('No se pudo eliminar la tarjeta');
      return false;
    }
  };

  const updateFlashcard = async (id: string, data: Partial<CreateFlashcardDto>, onSuccess: () => void) => {
    try {
      await flashcardRepository.updateFlashcard(id, data);
      toast.success('Tarjeta actualizada correctamente');
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al actualizar la tarjeta');
      } else {
        toast.error('Error al actualizar la tarjeta');
      }
    }
  };

  const suggestFlashcardEdit = async (data: CreateFlashcardDto, onSuccess: () => void) => {
    try {
      await flashcardRepository.createFlashcard({ ...data });
      toast.success('Sugerencia de cambio enviada para revisión del administrador');
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al enviar la sugerencia');
      } else {
        toast.error('Error al enviar la sugerencia');
      }
    }
  };

  return {
    taxonomies,
    flashcards,
    isLoading,
    hasMore,
    page,
    total,
    currentUserId,
    currentUserRole,
    setPage,
    loadTaxonomies,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    suggestFlashcardEdit,
    submitStudySession,
    toggleSave,
    reviewFlashcard,
    deleteFlashcard,
  };
};
