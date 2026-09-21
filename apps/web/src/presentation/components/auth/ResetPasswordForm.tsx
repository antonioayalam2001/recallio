import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../application/useAuth';
import { PasswordStrengthBar } from './PasswordStrengthBar';

const passwordPolicy = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)');

const resetPasswordSchema = z
  .object({
    newPassword: passwordPolicy,
    confirmNewPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setToken(searchParams.get('token'));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch('newPassword', '');

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    setHasError(false);
    const success = await resetPassword(token, data.newPassword, data.confirmNewPassword);
    if (!success) {
      setHasError(true);
    }
  };

  const inputClass = (error: boolean) =>
    `w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
      error ? 'border-error' : 'border-transparent'
    }`;

  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (token === null) {
    return (
      <div className="w-full max-w-md mx-auto bg-card border border-primary/10 p-8 rounded-3xl shadow-2xl text-center">
        <h3 className="text-2xl font-black text-error mb-2">Enlace Inválido</h3>
        <p className="text-sm opacity-70 mb-6">
          No se encontró un token de recuperación en la URL. Asegúrate de copiar el enlace completo desde tu correo.
        </p>
        <a href="/auth" className="bg-primary text-white font-bold py-3 px-6 rounded-xl inline-block hover:scale-[1.02] transition-transform">
          Ir al Inicio de Sesión
        </a>
      </div>
    );
  }

  return (
    <motion.div
      key="reset"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto relative mt-10"
    >
      <div className="bg-card shadow-2xl border border-primary/10 p-8 rounded-3xl relative overflow-hidden">
        <div className="text-center mb-6">
          <Lock className="w-10 h-10 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-black text-primary">Restablecer Contraseña</h3>
          <p className="text-sm opacity-70 mt-1">
            Ingresa tu nueva contraseña a continuación.
          </p>
        </div>

        {hasError && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-center">
            <p className="text-error font-semibold text-sm mb-2">
              El token es inválido o ha expirado.
            </p>
            <a href="/auth?forgot=true" className="text-primary text-sm font-bold hover:underline">
              Solicitar un nuevo enlace
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold opacity-70 ml-2">Nueva Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
                className={`${inputClass(!!errors.newPassword)} pr-10`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-error text-xs ml-2 mt-1 block">{errors.newPassword.message}</span>
            )}
            <PasswordStrengthBar password={passwordValue} />
          </div>

          <div>
            <label className="text-xs font-bold opacity-70 ml-2">Confirmar Nueva Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmNewPassword')}
                className={`${inputClass(!!errors.confirmNewPassword)} pr-10`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <span className="text-error text-xs ml-2 mt-1 block">
                {errors.confirmNewPassword.message}
              </span>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-4 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Guardar Contraseña'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};
