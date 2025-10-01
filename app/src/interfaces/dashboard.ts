export interface Dashboard {
  dashboardId: string;
  title: string;
  description: string;
  workspaceId: string;
  workspace: string;
  category: string;
  categoryColor: "blue" | "green" | "emerald" | "violet" | "yellow" | "slate";
  embedUrl: string;
}
