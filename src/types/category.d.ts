// Your existing enum for category types (ensure it matches what your backend uses/expects)
export enum CategoryTypeValues {
  MEDIUM = "MEDIUM", // From your previous examples
  ATTRIBUTE = "ATTRIBUTE", // From your previous examples
  // Add THEME and GENRE if these are also valid types your backend might send
  // based on your old Category interface's type: "ATTRIBUTE" | "THEME" | "GENRE"
  // If your Prisma model only has MEDIUM and ATTRIBUTE, stick to those.
  // For now, I'll assume your Prisma enum CategoryType only has MEDIUM and ATTRIBUTE.
}

export interface Category {
  id: number;
  name: string;
  description: string | null; // Prisma `String?` maps to `string | null`
  example_images: string[]; // Prisma `String[]` maps to `string[]`
  type: CategoryTypeValues; // Use your enum. Prisma `CategoryType` maps to this.
  created_at: string | Date; // API will likely send string, frontend might want Date
  updated_at: string | Date | null; // Prisma `DateTime?` maps to `string | Date | null`
  // Optional fields if your API sometimes includes them (e.g., through population/joins)
  // If these are not part of your CategoryResponseDto from the backend, you can omit them here
  // or make them optional (e.g., blogs?: Blog[]).
  // blogs_count?: number; // From your CategoryManagementPage component
  // posts_count?: number; // From your CategoryManagementPage component
}

// DTOs for creating/updating if you haven't defined them elsewhere for the frontend
export interface CreateCategoryDto {
  name: string;
  description?: string | null;
  example_images?: string[];
  type?: CategoryTypeValues;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string | null;
  example_images?: string[];
  type?: CategoryTypeValues;
}
