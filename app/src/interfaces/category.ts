export interface Category {
  id: string;
  name: string;
  color: "blue" | "green" | "emerald" | "violet" | "yellow" | "slate";
  description?: string;
  created_at: string;
  updated_at?: string;
  dashboard_count: number;
}

export interface CategoryCreate {
  name: string;
  color: "blue" | "green" | "emerald" | "violet" | "yellow" | "slate";
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  color?: "blue" | "green" | "emerald" | "violet" | "yellow" | "slate";
  description?: string;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
}
