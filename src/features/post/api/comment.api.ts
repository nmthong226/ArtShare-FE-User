import api from "@/api/baseApi";
import { Comment, CreateCommentDto } from "@/types/comment";

/** Get comments for a given post id (returns the response data only). */
export const fetchComments = async (
  targetId: number, // post / blog id
  parentCommentId?: number, // optional: fetch replies of this id
  targetType: "POST" | "BLOG" = "POST",
): Promise<Comment[]> => {
  const { data } = await api.get<Comment[]>("/comments", {
    params: {
      target_id: targetId,
      target_type: targetType,
      ...(parentCommentId != null && { parent_comment_id: parentCommentId }),
    },
  });
  return data;
};
/** NEW: create a comment (or reply) */
export const createComment = async (payload: CreateCommentDto) => {
  return await api.post<Comment>("/comments/create", payload);
};
/** Like a comment */
export const likeComment = async (commentId: number) => {
  return await api.post(`/comments/${commentId}/like`);
};
export const unlikeComment = async (commentId: number) => {
  return await api.post(`/comments/${commentId}/unlike`);
};
