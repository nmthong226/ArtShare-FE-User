import api from "@/api/baseApi";

interface UserProfile {
  username: string;
  email: string;
  full_name: string | null;
  profile_picture_url: string | null;
  bio: string | null;
  following_count: number;
  followers_count: number;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
