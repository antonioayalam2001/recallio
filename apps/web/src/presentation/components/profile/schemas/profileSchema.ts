import * as z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  lastName: z.string().min(2, 'El apellido paterno debe tener al menos 2 caracteres').max(50),
  motherLastName: z.string().min(2, 'El apellido materno debe tener al menos 2 caracteres').max(50),
  nickname: z
    .string()
    .min(3, 'El nickname debe tener al menos 3 caracteres')
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'El nickname solo puede contener letras, números y guiones bajos'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
