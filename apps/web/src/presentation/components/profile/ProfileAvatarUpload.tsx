import React, { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { authRepository } from '../../../infrastructure/api/AuthRepository';
import { toast } from 'sonner';
import { AvatarCropperModal } from '../auth/AvatarCropperModal';

interface ProfileAvatarUploadProps {
  currentAvatarUrl?: string | null;
  name: string;
  onAvatarUpdated: (url: string) => void;
}

export const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({
  currentAvatarUrl,
  name,
  onAvatarUpdated,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    try {
      setIsUploading(true);
      const result = await authRepository.uploadAvatar(blob);
      
      if (result.success && result.avatarUrl) {
        toast.success('Foto de perfil actualizada exitosamente');
        onAvatarUpdated(result.avatarUrl);
      } else {
        throw new Error('Error al actualizar la foto');
      }
    } catch (error) {
      console.error('Upload avatar error', error);
      toast.error('No se pudo actualizar la foto de perfil. Inténtalo más tarde.');
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center relative">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt={`Foto de perfil de ${name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-semibold text-gray-500 dark:text-gray-400">
              {getInitials(name)}
            </span>
          )}

          <div
            className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity cursor-pointer ${
              isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Subir nueva foto de perfil"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (!isUploading) fileInputRef.current?.click();
              }
            }}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-white text-xs font-medium">Cambiar foto</span>
              </>
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          JPG, PNG o WEBP. Máx 5MB.
        </p>
      </div>
      <AvatarCropperModal
        isOpen={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        imageSrc={originalImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};
