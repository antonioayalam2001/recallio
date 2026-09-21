import { useState, useCallback } from 'react';
import { authRepository } from '../infrastructure/api/AuthRepository';
import type { LoginCredentials, RegisterCredentials } from '../domain/models/auth';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = async () => {
    try {
      const { user } = await authRepository.me();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', user.role);
      localStorage.setItem('nickname', user.nickname);

      toast.success('¡Sesión iniciada correctamente!');
      setTimeout(() => (window.location.href = '/'), 1000);
    } catch {
      toast.error('Error al obtener perfil');
    }
  };

  const login = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await authRepository.login(data);
      await onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Credenciales inválidas');
      } else {
        toast.error('Credenciales inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterCredentials, avatarBlob?: Blob | null) => {
    setIsLoading(true);
    try {
      await authRepository.register(data);
      
      if (avatarBlob) {
        try {
          await authRepository.uploadAvatar(avatarBlob);
        } catch {
          toast.warning('Cuenta creada, pero la foto no se pudo subir. Intenta más tarde en tu perfil.', { duration: 5000 });
        }
      }

      await onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al registrar la cuenta');
      } else {
        toast.error('Error al registrar la cuenta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
    } catch {
      console.error(error);
    } finally {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('role');
      localStorage.removeItem('nickname');
      window.location.href = '/auth';
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await authRepository.forgotPassword(email);
      toast.success(result.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
      } else {
        toast.error('Error al procesar la solicitud');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string, confirmNewPassword: string) => {
    setIsLoading(true);
    try {
      const result = await authRepository.resetPassword(token, newPassword, confirmNewPassword);
      toast.success(result.message);
      setTimeout(() => (window.location.href = '/auth'), 2000);
      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Token inválido o expirado');
      } else {
        toast.error('Error al restablecer la contraseña');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkNickname = useCallback(async (nickname: string): Promise<boolean> => {
    try {
      const result = await authRepository.checkNickname(nickname);
      return result.available;
    } catch {
      return false;
    }
  }, []);

  const uploadAvatar = async (file: Blob): Promise<string | null> => {
    setIsLoading(true);
    try {
      const result = await authRepository.uploadAvatar(file);
      return result.avatarUrl;
    } catch {
      toast.error('No se pudo subir la foto de perfil');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    checkNickname,
    uploadAvatar,
    isLoading,
  };
};
