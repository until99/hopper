/**
 * Utilitários para trabalhar com tokens JWT
 */

interface JWTPayload {
  sub?: string;
  user_id?: string;
  exp?: number;
  iat?: number;
}

/**
 * Decodifica um token JWT sem verificar a assinatura
 * ATENÇÃO: Use apenas para verificar expiração local, não para validação de segurança
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um token JWT expirou
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true; // Se não conseguir decodificar ou não tiver exp, considera expirado
  }

  // exp é em segundos, Date.now() é em milissegundos
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Obtém o tempo restante em segundos até o token expirar
 */
export function getTokenTimeToExpiry(token: string): number {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
}

/**
 * Obtém a data de expiração do token
 */
export function getTokenExpirationDate(token: string): Date | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}
