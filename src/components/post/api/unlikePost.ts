import api from "@/api/baseApi";

interface LikePayload {
  target_id: number;
  target_type: string;
}
// Unlike the post
export const unlikePost = async (postId: number) => {
  const payload: LikePayload = {
    target_id: postId,
    target_type: "POST", // Assuming "post" is the target type
  };

  try {
    const response = await api.delete("/likes", { data: payload });
    return response.data;
  } catch (error) {
    console.error("Error unliking the post:", error);
    throw error;
  }
};
