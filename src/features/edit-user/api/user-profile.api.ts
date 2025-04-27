import api from "@/api/baseApi";

export interface UserProfile {
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
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export interface UpdateUserProfileParams {
  username?: string;
  email?: string;
  full_name?: string | null;
  profile_picture_url?: string | null;
  bio?: string | null;
}

export const patchUserProfile  = async (
  data: UpdateUserProfileParams
): Promise<UserProfile> => {
  try {
    const response = await api.patch<UserProfile>("/users/profile", data);
    console.log("Profile updated:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
