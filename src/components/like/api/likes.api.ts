// src/features/post/api/likes.api.ts
import { LikingUser, LikeApiResponseItem } from "../types/user"; // Adjust path

/**
 * Fetches the list of users who liked a specific post.
 * @param postId - The ID of the post.
 * @returns A promise that resolves to an array of LikingUser objects.
 * @throws Throws an error if the fetch request fails or the response is not ok.
 */
export const fetchLikingUsers = async (
  postId: number,
): Promise<LikingUser[]> => {
  const response = await fetch(`/api/posts/${postId}/likes`);

  if (!response.ok) {
    // Try to parse error details from the backend response
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage; // Use backend message if available
    } catch (e) {
      console.log("Failed to parse error response:", e);
      // Ignore if response body is not JSON or empty
    }
    throw new Error(errorMessage);
  }

  // Assuming the API returns an array of { user: LikingUser, ... } objects
  const data = (await response.json()) as LikeApiResponseItem[];

  // Extract the user object from each item
  const users = data.map((item) => item.user);

  // You could add additional logic here, e.g., fetching follow status for each user
  // relative to the current logged-in user if the API doesn't provide it directly.

  return users;
};
