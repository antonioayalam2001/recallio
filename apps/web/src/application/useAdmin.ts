import { useState, useCallback } from 'react';
import { adminRepository } from '../infrastructure/api/AdminRepository';
import type { Word } from '../domain/models/vocabulary';
import type { Flashcard } from '../domain/models/flashcard';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export const useAdmin = () => {
  const [pendingWords, setPendingWords] = useState<Word[]>([]);
  const [pendingCards, setPendingCards] = useState<Flashcard[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const fetchPendingWords = useCallback(async () => {
    setIsLoadingWords(true);
    try {
      const words = await adminRepository.getPendingWords();
      setPendingWords(words);
    } catch {
      toast.error('Error al cargar palabras pendientes');
    } finally {
      setIsLoadingWords(false);
    }
  }, []);

  const fetchPendingCards = useCallback(async () => {
    setIsLoadingCards(true);
    try {
      const cards = await adminRepository.getPendingFlashcards();
      setPendingCards(cards);
    } catch {
      toast.error('Error al cargar flashcards pendientes');
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  const moderateWord = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setIsActionLoading(true);
    try {
      await adminRepository.moderateWord(id, status);
      toast.success(status === 'APPROVED' ? 'Palabra aprobada' : 'Palabra rechazada');
      setPendingWords((prev) => prev.filter((w) => w.id !== id));
    } catch {
      toast.error('Error al moderar la palabra');
    } finally {
      setIsActionLoading(false);
    }
  };

  const moderateCard = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setIsActionLoading(true);
    try {
      await adminRepository.moderateFlashcard(id, status);
      toast.success(status === 'APPROVED' ? 'Flashcard aprobada' : 'Flashcard rechazada');
      setPendingCards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error('Error al moderar la flashcard');
    } finally {
      setIsActionLoading(false);
    }
  };

  const generateInvite = async (email: string) => {
    setIsActionLoading(true);
    try {
      const { token } = await adminRepository.generateInvite(email);
      setGeneratedToken(token);
      toast.success('Invitación generada exitosamente');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al generar invitación');
      } else {
        toast.error('Error al generar invitación');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    pendingWords,
    pendingCards,
    isLoadingWords,
    isLoadingCards,
    isActionLoading,
    generatedToken,
    setGeneratedToken,
    fetchPendingWords,
    fetchPendingCards,
    moderateWord,
    moderateCard,
    generateInvite,
  };
};
