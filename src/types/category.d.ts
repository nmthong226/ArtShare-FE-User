export interface Category {
  id: number;
  name: string; // maps to cate_name
  url: string;
  type: "ATTRIBUTE" | "THEME" | "GENRE"; // maps to cate_type
  description?: string; // maps to cate_description (nullable)
  created_at: Date; // maps to created_at
}
