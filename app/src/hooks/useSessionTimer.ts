import { useEffect, useRef, useCallback } from 'react';
import { authApiService } from '../services/AuthApi';
import { isTokenExpired, getTokenTimeToExpiry } from '../lib/jwtUtils';

interface UseSessionTimerProps {
  onSessionExpired: () => void;
  checkInterval?: number; // em milissegundos, padrão: 30 segundos
}

export function useSessionTimer({ 
  onSessionExpired, 
  checkInterval = 30000 // 30 segundos
}: UseSessionTimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const checkTokenValidity = useCallback(async () => {
    try {
      const token = authApiService.getToken();
      
      if (!token || !authApiService.isAuthenticated()) {
        onSessionExpired();
        return;
      }

      // Verifica se o token expirou localmente primeiro (mais rápido)
      if (isTokenExpired(token)) {
        console.log('Token expirado (verificação local)');
        onSessionExpired();
        return;
      }

      // Se o token está próximo de expirar (menos de 1 minuto), avisa
      const timeToExpiry = getTokenTimeToExpiry(token);
      if (timeToExpiry < 60) {
        console.log(`Token expira em ${timeToExpiry} segundos`);
      }

      // Verifica com o servidor se o token ainda é válido
      await authApiService.verifyToken();
      
      // Atualiza a última atividade
      lastActivityRef.current = Date.now();
    } catch (error) {
      console.log('Token expirado ou inválido, fazendo logout...');
      onSessionExpired();
    }
  }, [onSessionExpired]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(checkTokenValidity, checkInterval);
  }, [checkTokenValidity, checkInterval]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    // Inicia o timer quando o hook é montado
    if (authApiService.isAuthenticated()) {
      startTimer();
    }

    // Adiciona listeners para atividade do usuário
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      stopTimer();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [startTimer, stopTimer]);

  return {
    startTimer,
    stopTimer,
    resetTimer,
    lastActivity: lastActivityRef.current
  };
}
