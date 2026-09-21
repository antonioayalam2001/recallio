import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Loader2, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Upload, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../application/useAuth';
import { PasswordStrengthBar } from './PasswordStrengthBar';
import { AvatarCropperModal } from './AvatarCropperModal';

const passwordPolicy = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)');

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido paterno debe tener al menos 2 caracteres'),
    motherLastName: z.string().min(2, 'El apellido materno debe tener al menos 2 caracteres'),
    nickname: z
      .string()
      .min(3, 'El nickname debe tener al menos 3 caracteres')
      .max(20, 'El nickname no puede exceder 20 caracteres')
      .regex(/^[a-z0-9_]+$/, 'Solo letras minúsculas, números y guiones bajos'),
    email: z.string().min(1, 'El correo es requerido').email('Formato de correo inválido'),
    password: passwordPolicy,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    rememberMe: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

type NicknameStatus = 'idle' | 'checking' | 'available' | 'taken';

/**
 * Formulario de registro (Wizard de 3 pasos)
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser, isLoading, checkNickname } = useAuth();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSteps = 3;

  // Nickname checking state
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Avatar cropping state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [croppedAvatarBlob, setCroppedAvatarBlob] = useState<Blob | null>(null);
  const [croppedAvatarUrl, setCroppedAvatarUrl] = useState<string | null>(null);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched', // Validate as they type/leave
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch('password', '');
  const nicknameValue = watch('nickname', '');

  // Verificación de disponibilidad de nickname con debounce de 400ms
  const handleNicknameCheck = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (!value || value.length < 3 || !/^[a-z0-9_]+$/.test(value)) {
        setNicknameStatus('idle');
        return;
      }

      setNicknameStatus('checking');
      debounceTimer.current = setTimeout(async () => {
        const available = await checkNickname(value);
        setNicknameStatus(available ? 'available' : 'taken');
      }, 400);
    },
    [checkNickname],
  );

  useEffect(() => {
    handleNicknameCheck(nicknameValue);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [nicknameValue, handleNicknameCheck]);

  // Clean up Object URL for memory
  useEffect(() => {
    return () => {
      if (croppedAvatarUrl) URL.revokeObjectURL(croppedAvatarUrl);
    };
  }, [croppedAvatarUrl]);

  // Manejo de archivo original
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    
    // reset input
    e.target.value = '';
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedAvatarBlob(blob);
    if (croppedAvatarUrl) URL.revokeObjectURL(croppedAvatarUrl);
    setCroppedAvatarUrl(URL.createObjectURL(blob));
  };

  const [isValidating, setIsValidating] = useState(false);

  // Nav
  const handleNext = async () => {
    if (isValidating) return;
    
    let fieldsToValidate: (keyof RegisterFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'motherLastName'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['nickname', 'email', 'password', 'confirmPassword'];
    }

    setIsValidating(true);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep === 2 && nicknameStatus !== 'available') {
        setIsValidating(false);
        return;
      }
      setIsTransitioning(true);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      // Prevent double click on the next button from triggering the submit button instantly
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }
    
    // Small delay to prevent accidental double-clicks turning into submits
    setTimeout(() => {
      setIsValidating(false);
    }, 100);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async (data: RegisterFormValues) => {
    if (currentStep !== 3) return;
    if (nicknameStatus === 'taken') return;
    await registerUser(data, croppedAvatarBlob);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      handleNext();
    } else {
      handleSubmit(handleFinalSubmit)(e);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
      hasError ? 'border-error' : 'border-transparent'
    }`;

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <>
      <div className="mb-6">
        {/* Progress Bar indicator */}
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                currentStep >= step ? 'bg-primary' : 'bg-primary/20'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs font-semibold opacity-70">
          Paso {currentStep} de {totalSteps}
        </p>
      </div>

      <motion.form
        onSubmit={onFormSubmit}
        className="flex flex-col gap-4 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              {/* Nombre(s) */}
              <div>
                <label className="text-xs font-bold opacity-70 ml-2">Nombre(s)</label>
                <input
                  {...register('firstName')}
                  className={inputClass(!!errors.firstName)}
                  placeholder="Ej. Juan Carlos"
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <span className="text-error text-xs ml-2 mt-1 block">{errors.firstName.message}</span>
                )}
              </div>

              {/* Apellidos en fila */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold opacity-70 ml-2">Apellido Paterno</label>
                  <input
                    {...register('lastName')}
                    className={inputClass(!!errors.lastName)}
                    placeholder="Ej. García"
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <span className="text-error text-xs ml-2 mt-1 block">{errors.lastName.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold opacity-70 ml-2">Apellido Materno</label>
                  <input
                    {...register('motherLastName')}
                    className={inputClass(!!errors.motherLastName)}
                    placeholder="Ej. López"
                    autoComplete="additional-name"
                  />
                  {errors.motherLastName && (
                    <span className="text-error text-xs ml-2 mt-1 block">
                      {errors.motherLastName.message}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              {/* Nickname */}
              <div>
                <label className="text-xs font-bold opacity-70 ml-2">Nickname</label>
                <div className="relative">
                  <input
                    {...register('nickname')}
                    className={`${inputClass(!!errors.nickname || nicknameStatus === 'taken')} pr-10`}
                    placeholder="Ej. juan_92"
                    autoComplete="username"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5">
                    {nicknameStatus === 'checking' && (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    )}
                    {nicknameStatus === 'available' && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {nicknameStatus === 'taken' && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {errors.nickname && (
                  <span className="text-error text-xs ml-2 mt-1 block">{errors.nickname.message}</span>
                )}
                {!errors.nickname && nicknameStatus === 'taken' && (
                  <span className="text-error text-xs ml-2 mt-1 block">✗ Este nickname ya está en uso</span>
                )}
                <p className="text-xs opacity-40 ml-2 mt-1">Minúsculas, números y guiones bajos (3-20 chars)</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold opacity-70 ml-2">Correo Electrónico</label>
                <input
                  {...register('email')}
                  type="email"
                  className={inputClass(!!errors.email)}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="text-error text-xs ml-2 mt-1 block">{errors.email.message}</span>
                )}
              </div>

              {/* Contraseña + Barra de fortaleza */}
              <div>
                <label className="text-xs font-bold opacity-70 ml-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className={`${inputClass(!!errors.password)} pr-10`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-error text-xs ml-2 mt-1 block">{errors.password.message}</span>
                )}
                <PasswordStrengthBar password={passwordValue} />
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="text-xs font-bold opacity-70 ml-2">Confirmar Contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    className={`${inputClass(!!errors.confirmPassword)} pr-10`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-error text-xs ml-2 mt-1 block">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 min-h-[300px] justify-center items-center"
            >
              <h3 className="text-lg font-bold">Foto de Perfil</h3>
              <p className="text-sm opacity-70 mb-4 text-center">
                Elige una foto para tu avatar o sáltate este paso.
              </p>

              {croppedAvatarUrl ? (
                <div className="relative group cursor-pointer" onClick={() => setIsCropperOpen(true)}>
                  <img
                    src={croppedAvatarUrl}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Editar</span>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-primary/40 rounded-full w-32 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group">
                  <Upload className="w-8 h-8 mb-2 text-primary/60 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-semibold text-primary/80">Subir foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}

              {/* Recordarme */}
              <div className="flex items-center gap-2 mt-8">
                <input
                  type="checkbox"
                  id="rememberMeReg"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-primary bg-background border-primary/30 rounded focus:ring-primary"
                />
                <label htmlFor="rememberMeReg" className="text-sm font-semibold opacity-80 cursor-pointer">
                  Mantener sesión iniciada por 3 días
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isLoading || isValidating}
                className="flex-1 py-4 font-bold rounded-xl flex items-center justify-center gap-2 border-2 border-transparent bg-background hover:border-primary/20 transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" /> Atrás
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isValidating}
                className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
              >
                {isValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Siguiente <ChevronRight className="w-5 h-5" /></>}
              </button>
            ) : (
              <button
                disabled={isLoading || isTransitioning}
                type="submit"
                className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" /> Finalizar Registro
                  </>
                )}
              </button>
            )}
          </div>
          {currentStep === totalSteps && (
             <button
              type="button"
              onClick={() => {
                // Ensure we submit even without avatar
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              disabled={isLoading}
              className="text-sm font-bold opacity-70 hover:opacity-100 hover:text-primary transition-colors py-2"
             >
               Omitir este paso
             </button>
          )}
        </div>

        {/* Switch to login */}
        {currentStep === 1 && (
          <div className="mt-2 text-center">
            <p className="text-sm opacity-70">¿Ya tienes una cuenta?</p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="mt-1 text-primary font-bold hover:underline"
            >
              Inicia Sesión
            </button>
          </div>
        )}
      </motion.form>

      {/* Modal Cropper */}
      <AvatarCropperModal
        isOpen={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        imageSrc={originalImageSrc}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};
