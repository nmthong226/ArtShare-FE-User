// src/api/categories.ts (or similar)
import api from "@/api/baseApi";
import qs from "qs";
import type { Category } from "@/types/category"; // This will now use the updated Category type

export const getCategories = async (): Promise<Category[]> => {
  try {
    const queryParams = {
      // Adjust if your backend needs specific population or other params
      // For now, assuming a simple GET /categories
    };

    const queryString =
      Object.keys(queryParams).length > 0
        ? qs.stringify(queryParams, {
            addQueryPrefix: true,
            arrayFormat: "brackets",
          })
        : "";

    const endpoint = `/categories${queryString}`;
    console.log(`Fetching categories from: ${endpoint}`);

    // This response.data is now expected to conform to the updated Category[] type
    const response = await api.get<Category[]>(endpoint);

    // Parse dates from string to Date objects
    return response.data.map((cat) => ({
      ...cat,
      // Ensure these properties exist on 'cat' after the GET request.
      // 'cat' here is an element of response.data, which is typed as Category.
      // If your backend sends dates as strings (common in JSON), this parsing is good.
      created_at: new Date(cat.created_at as string), // Cast as string if sure API sends string
      updated_at: cat.updated_at ? new Date(cat.updated_at as string) : null, // Cast as string
    }));
  } catch (error) {
    console.error("Error in getCategories API call:", error);
    throw error;
  }
};
