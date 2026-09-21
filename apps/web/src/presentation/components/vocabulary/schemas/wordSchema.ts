import * as z from 'zod';

export const wordSchema = z.object({
  englishWord: z.string().min(1, 'La palabra en inglés es requerida'),
  spanishTranslation: z.string().min(1, 'La traducción es requerida'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  category: z.string().min(1, 'La categoría es requerida'),
  exampleSentence: z.string().optional(),
  exampleTranslation: z.string().optional(),
  isPrivate: z.boolean().optional().default(false),
});

export type WordFormValues = z.infer<typeof wordSchema>;
