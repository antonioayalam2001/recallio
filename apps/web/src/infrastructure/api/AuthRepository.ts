import { api } from '../api';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  NicknameAvailabilityResponse,
} from '../../domain/models/auth';
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async login(data: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async me(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async checkNickname(nickname: string): Promise<NicknameAvailabilityResponse> {
    const response = await api.get<NicknameAvailabilityResponse>(
      `/auth/check-nickname?value=${encodeURIComponent(nickname)}`,
    );
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  }

  async uploadAvatar(file: Blob): Promise<{ success: boolean; avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file, 'avatar.jpg');

    const response = await api.put<{ success: boolean; avatarUrl: string }>(
      '/auth/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async updateProfile(data: { firstName?: string; lastName?: string; motherLastName?: string; nickname?: string }): Promise<AuthResponse> {
    const response = await api.patch<AuthResponse>('/auth/me', data);
    return response.data;
  }
}

export const authRepository = new AuthRepository();
