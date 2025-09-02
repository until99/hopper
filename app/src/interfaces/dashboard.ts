export interface Dashboard {
  id: string;
  title: string;
  description: string;
  workspace: string;
  category: string;
  categoryColor: 'blue' | 'green' | 'emerald' | 'violet' | 'yellow' | 'slate';
  dashboardId: string;
}
