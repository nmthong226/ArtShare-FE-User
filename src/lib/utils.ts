import { Post } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "@/types/category";

export const convertCategory = (cat: any): Category => ({
  id: cat.id,
  name: cat.name,
  url: cat.url,
  type: cat.type,
  created_at: cat.createdAt,
});

export const mappedCategoryPost = (data: Post) => ({
  ...data,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
