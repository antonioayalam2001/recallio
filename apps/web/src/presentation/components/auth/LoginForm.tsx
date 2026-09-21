import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../../../application/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Formato de correo inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

/**
 * Formulario de inicio de sesión.
 * Incluye enlace de "¿Olvidaste tu contraseña?" y validación de política de contraseña.
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onForgotPassword }) => {
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  return (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Email */}
      <div>
        <label className="text-xs font-bold opacity-70 ml-2">Correo Electrónico</label>
        <input
          {...register('email')}
          className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
            errors.email ? 'border-error' : 'border-transparent'
          }`}
          placeholder="tucorreo@ejemplo.com"
          type="email"
          autoComplete="email"
        />
        {errors.email && (
          <span className="text-error text-xs ml-2 mt-1 block">{errors.email.message}</span>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <div className="flex items-center justify-between ml-2">
          <label className="text-xs font-bold opacity-70">Contraseña</label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-primary hover:underline font-semibold"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <input
          type="password"
          {...register('password')}
          className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
            errors.password ? 'border-error' : 'border-transparent'
          }`}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && (
          <span className="text-error text-xs ml-2 mt-1 block">{errors.password.message}</span>
        )}
      </div>

      {/* Recordarme */}
      <div className="flex items-center gap-2 mt-1 ml-2">
        <input
          type="checkbox"
          id="rememberMeLogin"
          {...register('rememberMe')}
          className="w-4 h-4 text-primary bg-background border-primary/30 rounded focus:ring-primary"
        />
        <label htmlFor="rememberMeLogin" className="text-sm font-semibold opacity-80 cursor-pointer">
          Mantener sesión iniciada por 3 días
        </label>
      </div>

      {/* Submit */}
      <button
        disabled={isLoading}
        type="submit"
        className="w-full mt-4 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" /> Entrar
          </>
        )}
      </button>

      {/* Switch to register */}
      <div className="mt-4 text-center">
        <p className="text-sm opacity-70">¿No tienes cuenta?</p>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="mt-1 text-primary font-bold hover:underline"
        >
          Regístrate aquí
        </button>
      </div>
    </motion.form>
  );
};
