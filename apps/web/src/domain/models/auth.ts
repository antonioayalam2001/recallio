export interface User {
  id: string;
  firstName: string;
  lastName: string;
  motherLastName: string;
  name: string;        // Nombre completo calculado
  nickname: string;    // Nombre de pantalla principal
  email: string;
  role: 'USER' | 'ADMIN';
  // TODO: avatarUrl se habilitará con Localstack S3
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  motherLastName: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface NicknameAvailabilityResponse {
  available: boolean;
}
