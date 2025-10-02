import { type Dashboard } from "../interfaces/dashboard";

const DASHBOARD_CACHE_KEY = "hopper_dashboards_cache";
const CACHE_EXPIRY_TIME = 1000 * 60 * 30; // 30 minutos

export interface CachedDashboards {
  data: Dashboard[];
  timestamp: number;
}

// Salva os dashboards no localStorage com timestamp
export const saveDashboardsToCache = (dashboards: Dashboard[]): void => {
  try {
    const cacheData: CachedDashboards = {
      data: dashboards,
      timestamp: Date.now(),
    };

    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(cacheData));
    console.log("Dashboards salvos no cache local", {
      count: dashboards.length,
    });
  } catch (error) {
    console.error("Erro ao salvar dashboards no cache:", error);
  }
};

// Recupera os dashboards do localStorage
export const getDashboardsFromCache = (): Dashboard[] | null => {
  try {
    const cachedData = localStorage.getItem(DASHBOARD_CACHE_KEY);

    if (!cachedData) {
      console.log("Nenhum cache de dashboards encontrado");
      return null;
    }

    const parsed: CachedDashboards = JSON.parse(cachedData);
    console.log("Dashboards carregados do cache local", {
      count: parsed.data.length,
      timestamp: new Date(parsed.timestamp).toLocaleString(),
    });

    return parsed.data;
  } catch (error) {
    console.error("Erro ao carregar dashboards do cache:", error);
    return null;
  }
};

// Verifica se o cache está válido (não expirado)
export const isCacheValid = (): boolean => {
  try {
    const cachedData = localStorage.getItem(DASHBOARD_CACHE_KEY);

    if (!cachedData) {
      return false;
    }

    const parsed: CachedDashboards = JSON.parse(cachedData);
    const now = Date.now();
    const isValid = now - parsed.timestamp < CACHE_EXPIRY_TIME;

    console.log("Verificação de validade do cache:", {
      cacheAge: Math.round((now - parsed.timestamp) / 1000 / 60), // em minutos
      isValid,
      expiryTime: Math.round(CACHE_EXPIRY_TIME / 1000 / 60), // em minutos
    });

    return isValid;
  } catch (error) {
    console.error("Erro ao verificar validade do cache:", error);
    return false;
  }
};

// Limpa o cache de dashboards
export const clearDashboardsCache = (): void => {
  try {
    localStorage.removeItem(DASHBOARD_CACHE_KEY);
    console.log("Cache de dashboards limpo");
  } catch (error) {
    console.error("Erro ao limpar cache de dashboards:", error);
  }
};

// Verifica se existe cache válido e retorna os dados ou null
export const getValidCachedDashboards = (): Dashboard[] | null => {
  if (isCacheValid()) {
    return getDashboardsFromCache();
  }

  // Se o cache expirou, limpa para manter o localStorage limpo
  clearDashboardsCache();
  return null;
};

// Força o refresh removendo o cache e indicando que deve buscar da API
export const forceRefreshDashboards = (): void => {
  clearDashboardsCache();
  console.log("Refresh forçado - cache limpo, próxima busca será da API");
};
