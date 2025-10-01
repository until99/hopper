const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://hopper-glyb.onrender.com'}/powerbi`;

export interface APIPowerBIReport {
  id: string;
  name: string;
  description?: string;
  datasetId: string;
  webUrl: string;
  embedUrl: string;
  datasetWorkspaceId: string;
  workspace_id: string;
  workspace_name: string;
  reportType?: string;
  isFromPbix?: boolean;
  isOwnedByMe?: boolean;
  users?: any[];
  subscriptions?: any[];
  reportFlags?: number;
}

export interface PowerBIGroup {
  id: string;
  name: string;
  description?: string;
}

// Função auxiliar para fazer requisições autenticadas
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // 401 sempre indica problema de autenticação da aplicação
      localStorage.removeItem('auth_token');
      throw new Error('Token expirado ou inválido');
    } else if (response.status === 403) {
      // 403 pode ser problema de permissões do PowerBI ou autenticação
      try {
        const errorData = await response.json();
        if (errorData.detail && 
            (errorData.detail.includes('token') || 
             errorData.detail.includes('unauthorized') || 
             errorData.detail.includes('authentication'))) {
          // É um problema de autenticação
          localStorage.removeItem('auth_token');
          throw new Error('Token expirado ou inválido');
        } else {
          // É um problema de permissões do PowerBI
          throw new Error('Sem permissão para acessar o PowerBI ou serviço não configurado');
        }
      } catch (parseError) {
        // Se não conseguir fazer parse, assume que é problema de permissões
        throw new Error('Sem permissão para acessar o PowerBI ou serviço não configurado');
      }
    } else if (response.status === 503) {
      throw new Error('PowerBI não está configurado no servidor');
    } else {
      throw new Error(`Erro no servidor: ${response.status}`);
    }
  }
  
  return response.json();
}

export const api = {
  async getGroups() {
    return authenticatedFetch(`${API_BASE_URL}/groups`);
  },

  async getReports() {
    return authenticatedFetch(`${API_BASE_URL}/reports`);
  },

  async getReportsByGroup(groupId: string) {
    return authenticatedFetch(`${API_BASE_URL}/reports/group/${groupId}`);
  },

  async deleteReport(groupId: string, reportId: string) {
    console.log(`${API_BASE_URL}/groups/${groupId}/reports/${reportId}`);
    
    return authenticatedFetch(
      `${API_BASE_URL}/groups/${groupId}/reports/${reportId}`,
      { method: "DELETE" }
    );
  },
};
