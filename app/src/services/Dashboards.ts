const API_BASE_URL = "http://localhost:8000/powerbi";

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

export const api = {
  async getGroups() {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) throw new Error("Failed to fetch groups");
    const res = await response.json();
    // console.log(res);

    return res;
  },

  async getReports() {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error("Failed to fetch reports");

    const res = await response.json();
    // console.log(res);

    return res;
  },

  async getReportsByGroup(groupId: string) {
    const response = await fetch(`${API_BASE_URL}/reports/group/${groupId}`);
    if (!response.ok) throw new Error("Failed to fetch reports by group");
    const res = await response.json();
    // console.log(res);

    return res;
  },

  async deleteReport(groupId: string, reportId: string) {
    console.log(`${API_BASE_URL}/groups/${groupId}/reports/${reportId}`);

    const response = await fetch(
      `${API_BASE_URL}/groups/${groupId}/reports/${reportId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete report");
    const res = await response.json();
    console.log(res);

    return res;
  },
};
