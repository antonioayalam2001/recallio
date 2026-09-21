import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Group, Flashcard } from '../../../../domain/models/flashcard';

export const flashcardEditSchema = z.object({
  groupName: z.string().min(1, 'El grupo es requerido'),
  topicName: z.string().min(1, 'El tema es requerido'),
  categoryName: z.string().min(1, 'La categoría es requerida'),
  front: z.string().min(3, 'El anverso debe tener al menos 3 caracteres'),
  back: z.string().min(3, 'El reverso debe tener al menos 3 caracteres'),
});

export type FlashcardEditFormValues = z.infer<typeof flashcardEditSchema>;

interface UseEditFlashcardFormProps {
  taxonomies: Group[];
  card: Flashcard | null;
  isOpen: boolean;
  canEditDirect: boolean;
  updateFlashcard: (id: string, data: Record<string, unknown>, cb: () => void) => Promise<void>;
  suggestFlashcardEdit: (data: Record<string, unknown>, cb: () => void) => Promise<void>;
  onUpdated: () => void;
  onClose: () => void;
}

export const useEditFlashcardForm = ({
  taxonomies,
  card,
  isOpen,
  canEditDirect,
  updateFlashcard,
  suggestFlashcardEdit,
  onUpdated,
  onClose,
}: UseEditFlashcardFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FlashcardEditFormValues>({
    resolver: zodResolver(flashcardEditSchema),
    defaultValues: {
      groupName: '',
      topicName: '',
      categoryName: '',
      front: '',
      back: '',
    },
  });

  // Precargar datos al abrir el modal con la tarjeta seleccionada
  useEffect(() => {
    if (card && isOpen) {
      const cardData = card as Record<string, unknown>;
      reset({
        groupName: cardData.groupName || cardData.group?.name || '',
        topicName: cardData.topicName || cardData.topic?.name || '',
        categoryName: cardData.categoryName || cardData.category?.name || '',
        front: card.front || '',
        back: card.back || '',
      });
    }
  }, [card, isOpen, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const frontValue = watch('front');
  const backValue = watch('back');
  const selectedGroup = watch('groupName');
  const selectedTopic = watch('topicName');
  const selectedCategory = watch('categoryName');

  const currentGroupObj = taxonomies.find((g) => g.name === selectedGroup);
  const availableTopics = currentGroupObj ? currentGroupObj.topics : [];
  const currentTopicObj = availableTopics.find((t) => t.name === selectedTopic);
  const availableCategories = currentTopicObj ? currentTopicObj.categories : [];

  const handleGroupChange = (val: string) => {
    setValue('groupName', val, { shouldValidate: true });
    setValue('topicName', '', { shouldValidate: true });
    setValue('categoryName', '', { shouldValidate: true });
  };

  const handleTopicChange = (val: string) => {
    setValue('topicName', val, { shouldValidate: true });
    setValue('categoryName', '', { shouldValidate: true });
  };

  const handleCategoryChange = (val: string) => {
    setValue('categoryName', val, { shouldValidate: true });
  };

  const onSubmit = async (data: FlashcardEditFormValues) => {
    if (!card) return;
    setIsSubmitting(true);

    if (canEditDirect) {
      // Edición directa de tarjeta (privada propia o administrador)
      await updateFlashcard(
        card.id,
        {
          front: data.front,
          back: data.back,
        },
        () => {
          onUpdated();
          onClose();
        }
      );
    } else {
      // Sugerencia de cambio a moderación para tarjeta pública
      await suggestFlashcardEdit(
        {
          ...data,
          originalFlashcardId: card.id,
          isPrivate: false,
        } as Record<string, unknown>,
        () => {
          onUpdated();
          onClose();
        }
      );
    }
    setIsSubmitting(false);
  };

  return {
    form: {
      register,
      handleSubmit,
      errors,
      setValue,
    },
    values: {
      frontValue,
      backValue,
      selectedGroup,
      selectedTopic,
      selectedCategory,
    },
    taxonomiesDerived: {
      availableTopics,
      availableCategories,
    },
    handlers: {
      handleGroupChange,
      handleTopicChange,
      handleCategoryChange,
      onSubmit,
    },
    isSubmitting,
  };
};
