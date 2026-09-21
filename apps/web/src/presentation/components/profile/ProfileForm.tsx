import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { authRepository } from '../../../infrastructure/api/AuthRepository';
import { toast } from 'sonner';
import type { AuthResponse } from '../../../domain/models/auth';
import { profileSchema, type ProfileFormValues } from './schemas/profileSchema';
import { useNicknameCheck } from './hooks/useNicknameCheck';

interface ProfileFormProps {
  user: NonNullable<AuthResponse['user']>;
  onProfileUpdated: (user: NonNullable<AuthResponse['user']>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onProfileUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setError,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      motherLastName: user.motherLastName,
      nickname: user.nickname,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const nicknameValue = watch('nickname');
  const { nicknameStatus } = useNicknameCheck(user.nickname, nicknameValue);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (nicknameStatus === 'taken') {
        setError('nickname', { type: 'manual', message: 'El nickname ya está en uso' });
        setIsSubmitting(false);
        return;
      }

      if (data.nickname !== user.nickname) {
        const check = await authRepository.checkNickname(data.nickname);
        if (!check.available) {
          setError('nickname', { type: 'manual', message: 'El nickname ya está en uso' });
          setIsSubmitting(false);
          return;
        }
      }

      const result = await authRepository.updateProfile(data);
      if (result.user) {
        toast.success('Perfil actualizado correctamente');
        onProfileUpdated(result.user);
      }
    } catch (error: unknown) {
      console.error('Update profile error', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre(s)
          </label>
          <input
            {...register('firstName')}
            id="firstName"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Apellido Paterno
          </label>
          <input
            {...register('lastName')}
            id="lastName"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="motherLastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Apellido Materno
          </label>
          <input
            {...register('motherLastName')}
            id="motherLastName"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            aria-invalid={!!errors.motherLastName}
          />
          {errors.motherLastName && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.motherLastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nickname
          </label>
          <div className="relative">
            <input
              {...register('nickname')}
              id="nickname"
              className={`w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors disabled:opacity-50 ${
                errors.nickname || nicknameStatus === 'taken' ? 'border-red-500' : ''
              }`}
              disabled={isSubmitting}
              aria-invalid={!!errors.nickname || nicknameStatus === 'taken'}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5">
              {nicknameStatus === 'checking' && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
              {nicknameStatus === 'available' && (
                <span className="text-green-500 font-bold" title="Disponible">✓</span>
              )}
              {nicknameStatus === 'taken' && (
                <span className="text-red-500 font-bold" title="No disponible">✗</span>
              )}
            </div>
          </div>
          {errors.nickname && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.nickname.message}</p>
          )}
          {!errors.nickname && nicknameStatus === 'taken' && (
            <p className="text-sm text-red-600 dark:text-red-400">El nickname ya está en uso</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed"
          title="El correo no se puede cambiar"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          El correo electrónico no puede ser modificado.
        </p>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </form>
  );
};
