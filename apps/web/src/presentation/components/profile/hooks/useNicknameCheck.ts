import { useState, useCallback, useRef, useEffect } from 'react';
import { authRepository } from '../../../../infrastructure/api/AuthRepository';

export const useNicknameCheck = (currentNickname: string, nicknameValue: string) => {
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNicknameCheck = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (value === currentNickname) {
        setNicknameStatus('idle');
        return;
      }

      if (!value || value.length < 3 || !/^[a-zA-Z0-9_]+$/.test(value)) {
        setNicknameStatus('idle');
        return;
      }

      setNicknameStatus('checking');
      debounceTimer.current = setTimeout(async () => {
        try {
          const check = await authRepository.checkNickname(value);
          setNicknameStatus(check.available ? 'available' : 'taken');
        } catch {
          setNicknameStatus('idle');
        }
      }, 400);
    },
    [currentNickname],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleNicknameCheck(nicknameValue);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [nicknameValue, handleNicknameCheck]);

  return { nicknameStatus };
};
