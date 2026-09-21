import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wordSchema, type WordFormValues } from '../schemas/wordSchema';
import { useVocabulary } from '../../../../application/useVocabulary';

interface UseSuggestWordFormProps {
  suggestWord: ReturnType<typeof useVocabulary>['suggestWord'];
  onSuccess: () => void;
}

export function useSuggestWordForm({ suggestWord, onSuccess }: UseSuggestWordFormProps) {
  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordSchema),
    defaultValues: {
      level: 'A1',
      englishWord: '',
      spanishTranslation: '',
      category: '',
      exampleSentence: '',
      exampleTranslation: '',
      isPrivate: false,
    },
  });

  const onSubmit = async (data: WordFormValues) => {
    // La API espera exampleSentence y exampleTranslation opcionalmente.
    const payload = { ...data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await suggestWord(payload as any, () => {
      onSuccess();
      form.reset();
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
