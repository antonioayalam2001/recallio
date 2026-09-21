import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const inviteSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;

interface UseInviteFormProps {
  generateInvite: (email: string) => Promise<void>;
}

export const useInviteForm = ({ generateInvite }: UseInviteFormProps) => {
  const {
    register: registerInvite,
    handleSubmit: handleInviteSubmit,
    formState: { errors: inviteErrors },
    reset: resetInviteForm,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
  });

  const onGenerateInvite = async (data: InviteFormValues) => {
    await generateInvite(data.email);
    resetInviteForm();
  };

  return {
    registerInvite,
    handleInviteSubmit,
    onGenerateInvite,
    inviteErrors,
    resetInviteForm,
  };
};
