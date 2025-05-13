import { Post } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const mappedCategoryPost = (data: Post) => ({
  ...data,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  const targetDate = new Date(date);
  const today = new Date();

  // Normalize to midnight for accurate date-only comparison
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const msInDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((now.getTime() - target.getTime()) / msInDay);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit"
  });
};