const API_BASE_URL = "http://localhost:8000";

export interface PowerBIReport {
  id: string;
  name: string;
  description?: string;
  datasetId: string;
  webUrl: string;
  embedUrl: string;
  workspaceId?: string;
  workspaceName?: string;
}

export interface PowerBIGroup {
  id: string;
  name: string;
  description?: string;
}

export const api = {
  // Buscar todos os grupos
  async getGroups() {
    const response = await fetch(`${API_BASE_URL}/powerbi/groups`);
    if (!response.ok) throw new Error("Failed to fetch groups");
    return response.json();
  },

  // Buscar todos os relatórios
  async getReports() {
    const response = await fetch(`${API_BASE_URL}/powerbi/reports`);
    if (!response.ok) throw new Error("Failed to fetch reports");
    return response.json();
  },

  // Buscar relatórios por grupo
  async getReportsByGroup(groupId: string) {
    const response = await fetch(
      `${API_BASE_URL}/powerbi/reports/group/${groupId}`
    );
    if (!response.ok) throw new Error("Failed to fetch reports by group");
    return response.json();
  },

  // Deletar relatório
  async deleteReport(groupId: string, reportId: string) {
    const response = await fetch(
      `${API_BASE_URL}/powerbi/groups/${groupId}/reports/${reportId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete report");
    return response.json();
  },
};
