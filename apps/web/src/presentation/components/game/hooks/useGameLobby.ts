import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../infrastructure/api';
import type { GameQuestion } from '../../../../application/useGame';
import type { GamePhase, CategoryCount, QuestionOption } from '../types';

const QUESTION_COUNT_OPTIONS = [10, 20, 30, 50];

interface UseGameLobbyOptions {
  onPhaseChange: (phase: GamePhase) => void;
  onQuestionsLoaded: (questions: GameQuestion[]) => void;
}

export interface UseGameLobbyReturn {
  levelFilter: string;
  setLevelFilter: (level: string) => void;
  selectedCategories: string[];
  availableCategories: CategoryCount[];
  isLoadingCategories: boolean;
  totalAvailableWords: number;
  questionOptions: QuestionOption[];
  totalQuestions: number;
  selectedQuestions: number;
  setSelectedQuestions: (n: number) => void;
  canStart: boolean;
  toggleCategory: (catName: string) => void;
  selectAllCategories: () => void;
  selectAllOrClear: () => void;
  startGame: () => Promise<void>;
}

/**
 * Hook que encapsula todo el estado y la lógica del lobby del juego:
 * filtro de nivel, selección de categorías, cálculo adaptativo de preguntas
 * y llamada a la API para generar la partida.
 *
 * Extraído de GameArena.tsx (G1 del plan de refactorización).
 */
export function useGameLobby({
  onPhaseChange,
  onQuestionsLoaded,
}: UseGameLobbyOptions): UseGameLobbyReturn {
  const [selectedQuestions, setSelectedQuestions] = useState(10);
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<CategoryCount[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Cargar categorías con conteo y purgar las inválidas cuando cambia el nivel
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingCategories(true);
    const url = levelFilter ? `/words/categories?level=${levelFilter}` : '/words/categories';
    api
      .get(url)
      .then((res) => {
        const list: CategoryCount[] = Array.isArray(res.data) ? res.data : [];
        setAvailableCategories(list);
        const validNames = new Set(list.map((c) => c.category));
        setSelectedCategories((prev) => prev.filter((cat) => validNames.has(cat)));
      })
      .catch((err) => {
        console.error('Error al cargar categorías:', err);
      })
      .finally(() => setIsLoadingCategories(false));
  }, [levelFilter]);

  /** Total de palabras disponibles según la selección actual de categorías */
  const totalAvailableWords = useMemo(() => {
    if (selectedCategories.length === 0) {
      return availableCategories.reduce((acc, c) => acc + c.count, 0);
    }
    return availableCategories
      .filter((c) => selectedCategories.includes(c.category))
      .reduce((acc, c) => acc + c.count, 0);
  }, [availableCategories, selectedCategories]);

  /** Opciones de cantidad de preguntas calculadas dinámicamente */
  const questionOptions = useMemo((): QuestionOption[] => {
    if (totalAvailableWords < 4) return [];
    if (totalAvailableWords < 10) {
      return [{ value: totalAvailableWords, label: `${totalAvailableWords}`, isAll: true }];
    }
    const standard = QUESTION_COUNT_OPTIONS.filter((n) => n <= totalAvailableWords);
    const options = standard.map((n) => ({ value: n, label: `${n}`, isAll: false }));
    if (!standard.includes(totalAvailableWords)) {
      options.push({ value: totalAvailableWords, label: `Todas (${totalAvailableWords})`, isAll: true });
    }
    return options;
  }, [totalAvailableWords]);

  /** Cantidad efectiva de preguntas (derivada, no editable directamente) */
  const totalQuestions = useMemo(() => {
    if (totalAvailableWords < 10) return totalAvailableWords;
    const validValues = questionOptions.map((o) => o.value);
    if (validValues.includes(selectedQuestions)) return selectedQuestions;
    return validValues[0] ?? 10;
  }, [totalAvailableWords, questionOptions, selectedQuestions]);

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories(availableCategories.map((c) => c.category));
  };

  const selectAllOrClear = () => {
    setSelectedCategories([]);
  };

  const canStart =
    totalAvailableWords >= 4 &&
    totalQuestions >= 4 &&
    totalQuestions <= totalAvailableWords;

  const startGame = async () => {
    if (totalAvailableWords < 4) {
      toast.error('Se requieren al menos 4 palabras en el catálogo para generar opciones distractoras.');
      return;
    }
    onPhaseChange('loading');
    try {
      const res = await api.post('/game/generate', {
        totalQuestions,
        ...(levelFilter ? { level: levelFilter } : {}),
        ...(selectedCategories.length > 0 ? { categories: selectedCategories } : {}),
      });
      onQuestionsLoaded(res.data);
      onPhaseChange('playing');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status !== 401) {
        toast.error(
          axiosErr.response?.data?.message ||
            'No hay suficientes palabras para esa configuración. Intenta con menos preguntas o agregando más categorías.'
        );
      }
      onPhaseChange('lobby');
    }
  };

  return {
    levelFilter,
    setLevelFilter,
    selectedCategories,
    availableCategories,
    isLoadingCategories,
    totalAvailableWords,
    questionOptions,
    totalQuestions,
    selectedQuestions,
    setSelectedQuestions,
    canStart,
    toggleCategory,
    selectAllCategories,
    selectAllOrClear,
    startGame,
  };
}
