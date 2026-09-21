import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  NicknameAvailabilityResponse,
} from '../models/auth';

export interface IAuthRepository {
  login(data: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterCredentials): Promise<AuthResponse>;
  me(): Promise<AuthResponse>;
  logout(): Promise<void>;
  checkNickname(nickname: string): Promise<NicknameAvailabilityResponse>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(token: string, newPassword: string, confirmNewPassword: string): Promise<{ message: string }>;
  uploadAvatar(file: Blob): Promise<{ success: boolean; avatarUrl: string }>;
  updateProfile(data: { firstName?: string; lastName?: string; motherLastName?: string; nickname?: string }): Promise<AuthResponse>;
}
