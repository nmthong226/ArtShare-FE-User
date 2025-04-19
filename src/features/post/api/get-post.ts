import api from "@/api/baseApi";
import { Post } from "@/types/post";

export const fetchPost = async (postId: number) => {
  return await api.get<Post>(`/posts/${postId}`);
  // return { data: postData };
};
