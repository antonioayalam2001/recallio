import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Group } from '../../../../domain/models/flashcard';

export const flashcardSchema = z.object({
  groupName: z.string().min(1, 'El grupo es requerido'),
  topicName: z.string().min(1, 'El tema es requerido'),
  categoryName: z.string().min(1, 'La categoría es requerida'),
  front: z.string().min(3, 'El anverso debe tener al menos 3 caracteres'),
  back: z.string().min(3, 'El reverso debe tener al menos 3 caracteres'),
  isPrivate: z.boolean().optional().default(false),
});

export type FlashcardFormValues = z.infer<typeof flashcardSchema>;

interface UseCreateFlashcardFormProps {
  taxonomies: Group[];
  createFlashcard: (data: Record<string, unknown>, cb: () => void) => Promise<void>;
  onCreated: () => void;
  onClose: () => void;
}

export const useCreateFlashcardForm = ({
  taxonomies,
  createFlashcard,
  onCreated,
  onClose,
}: UseCreateFlashcardFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      groupName: '',
      topicName: '',
      categoryName: '',
      front: '',
      back: '',
      isPrivate: false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const frontValue = watch('front');
  const backValue = watch('back');
  const selectedGroup = watch('groupName');
  const selectedTopic = watch('topicName');
  const selectedCategory = watch('categoryName');
  const isPrivate = watch('isPrivate');

  const currentGroupObj = taxonomies.find((g) => g.name === selectedGroup);
  const availableTopics = currentGroupObj ? currentGroupObj.topics : [];
  const currentTopicObj = availableTopics.find((t) => t.name === selectedTopic);
  const availableCategories = currentTopicObj ? currentTopicObj.categories : [];

  const handleGroupChange = (val: string) => {
    setValue('groupName', val);
    setValue('topicName', '');
    setValue('categoryName', '');
  };

  const handleTopicChange = (val: string) => {
    setValue('topicName', val);
    setValue('categoryName', '');
  };

  const handleCategoryChange = (val: string) => {
    setValue('categoryName', val);
  };

  const onSubmit = async (data: FlashcardFormValues) => {
    setIsSubmitting(true);
    await createFlashcard(data, () => {
      reset();
      onCreated();
      onClose();
    });
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
      isPrivate,
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
    reset,
  };
};
