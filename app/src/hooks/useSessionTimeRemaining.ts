import { useState, useEffect, useCallback } from "react";
import { authApiService } from "../services/AuthApi";
import { getTokenTimeToExpiry } from "../lib/jwtUtils";

interface UseSessionTimeRemainingResult {
  timeRemaining: string;
  isExpiringSoon: boolean;
  hasValidSession: boolean;
}

export function useSessionTimeRemaining(): UseSessionTimeRemainingResult {
  const [timeRemaining, setTimeRemaining] = useState<string>("--:--");
  const [isExpiringSoon, setIsExpiringSoon] = useState<boolean>(false);
  const [hasValidSession, setHasValidSession] = useState<boolean>(false);

  const updateTimeRemaining = useCallback(() => {
    try {
      const token = authApiService.getToken();

      if (!token || !authApiService.isAuthenticated()) {
        setTimeRemaining("--:--");
        setIsExpiringSoon(false);
        setHasValidSession(false);
        return;
      }

      const secondsRemaining = getTokenTimeToExpiry(token);

      if (secondsRemaining <= 0) {
        setTimeRemaining("Expirado");
        setIsExpiringSoon(true);
        setHasValidSession(false);
        return;
      }

      setHasValidSession(true);

      // Considera "expirando em breve" se restam menos de 5 minutos
      setIsExpiringSoon(secondsRemaining <= 300);

      // Formata o tempo em MM:SS
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;

      if (minutes >= 60) {
        // Se mais de 1 hora, mostra HH:MM
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${remainingMinutes
            .toString()
            .padStart(2, "0")}h`
        );
      } else {
        // Menos de 1 hora, mostra MM:SS
        setTimeRemaining(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    } catch (error) {
      console.error("Erro ao calcular tempo restante da sessão:", error);
      setTimeRemaining("--:--");
      setIsExpiringSoon(false);
      setHasValidSession(false);
    }
  }, []);

  useEffect(() => {
    // Atualiza imediatamente
    updateTimeRemaining();

    // Atualiza a cada segundo
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [updateTimeRemaining]);

  return {
    timeRemaining,
    isExpiringSoon,
    hasValidSession,
  };
}
