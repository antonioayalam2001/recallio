import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../application/useAuth';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Formato de correo inválido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

/**
 * Formulario de recuperación de contraseña.
 * Solicita el email y muestra un mensaje genérico de éxito/error.
 * El token se genera en backend y se simula en consola (DEV).
 */
export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const { forgotPassword, isLoading } = useAuth();
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await forgotPassword(data.email);
    setSent(true);
  };

  return (
    <motion.div
      key="forgot"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Botón volver */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-primary hover:underline font-semibold mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al login
      </button>

      <div className="text-center mb-6">
        <KeyRound className="w-10 h-10 text-primary mx-auto mb-2" />
        <h3 className="text-xl font-black text-primary">Recuperar Contraseña</h3>
        <p className="text-sm opacity-70 mt-1">
          Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
      </div>

      {sent ? (
        <div className="text-center py-4">
          <p className="text-green-500 font-semibold text-sm">
            ✓ Si el correo está registrado, recibirás las instrucciones en breve.
          </p>
          <p className="text-xs opacity-50 mt-2">
            Revisa también tu carpeta de spam.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold opacity-70 ml-2">Correo Electrónico</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
                errors.email ? 'border-error' : 'border-transparent'
              }`}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-error text-xs ml-2 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-2 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Enviar instrucciones'
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};
