sed -i '' 's|import { api } from '"'"'../../../infrastructure/api'"'"';|import { useFlashcards } from '"'"'../../../application/useFlashcards'"'"';|g' src/presentation/components/flashcards/CreateFlashcardModal.tsx
sed -i '' 's|const \[isSubmitting, setIsSubmitting\] = useState(false);|const { createFlashcard } = useFlashcards();\n  const [isSubmitting, setIsSubmitting] = useState(false);|g' src/presentation/components/flashcards/CreateFlashcardModal.tsx
sed -i '' -e '/const onSubmit = async/,/  };/c\
  const onSubmit = async (data: FlashcardFormValues) => {\
    setIsSubmitting(true);\
    await createFlashcard(data, () => {\
      reset();\
      onCreated();\
      onClose();\
    });\
    setIsSubmitting(false);\
  };' src/presentation/components/flashcards/CreateFlashcardModal.tsx
