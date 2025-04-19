export interface Category {
  id: number;
  cateName: string; // maps to cate_name
  urls: string[]; // maps to urls
  cateType: "ATTRIBUTE" | "THEME" | "GENRE"; // maps to cate_type
  cateDescription?: string; // maps to cate_description (nullable)
  created_at: Date; // maps to created_at
}
