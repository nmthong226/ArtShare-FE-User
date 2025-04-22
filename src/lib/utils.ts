import { Post } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const mappedCategoryPost = (data: Post) => ({
  ...data,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
