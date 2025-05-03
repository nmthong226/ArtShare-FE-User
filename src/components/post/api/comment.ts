import api from "@/api/baseApi";
import { Comment, CreateCommentDto } from "@/types/comment";

/** Get comments for a given post id (returns the response data only). */
export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data } = await api.get<Comment[]>("/comments", {
    params: { target_id: postId, target_type: "POST" },
  });
  return data;
};
/** NEW: create a comment (or reply) */
export const createComment = async (payload: CreateCommentDto) => {
  return await api.post<Comment>("/comments/create", payload);
};
