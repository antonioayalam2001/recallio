import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProfileAvatarUpload } from './ProfileAvatarUpload';
import { ProfileForm } from './ProfileForm';
import { authRepository } from '../../../infrastructure/api/AuthRepository';
import type { User } from '../../../domain/models/auth';
import { toast } from 'sonner';

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authRepository.me();
        setUser(response.user);
      } catch (error) {
        console.error('Error fetching profile', error);
        toast.error('No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Mi Perfil
        </h1>
        
        <div className="mb-10">
          <ProfileAvatarUpload
            currentAvatarUrl={user.avatarUrl}
            name={user.name}
            onAvatarUpdated={(url) => setUser({ ...user, avatarUrl: url })}
          />
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <ProfileForm
            user={user}
            onProfileUpdated={(updatedUser) => setUser(updatedUser)}
          />
        </div>
      </div>
    </div>
  );
};
