export enum CategoryType {
  ATTRIBUTE = "ATTRIBUTE",
  THEME = "THEME",
  GENRE = "GENRE", // Add other values if your backend supports them
}

export interface Category {
  id: number;
  cateName: string; // maps to `cate_name` in backend
  urls: string[]; // maps to `urls`
  cateType: CategoryType; // maps to `cate_type` with enum type
  cateDescription?: string; // maps to `cate_description` (nullable)
  created_at: Date; // maps to `created_at`
}
