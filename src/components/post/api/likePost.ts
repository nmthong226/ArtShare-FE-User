import api from "@/api/baseApi";
import { Post } from "@/types/post";
interface LikePayload {
  target_id: number;
  target_type: string;
}

export const likePost = async (postId: number) => {
  const payload: LikePayload = {
    target_id: postId,
    target_type: "POST", // Assuming "post" is the target type
  };

  try {
    const response = await api.post("/likes", payload);
    return response.data;
  } catch (error) {
    console.error("Error liking the post:", error);
    throw error;
  }
};
