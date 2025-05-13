import api from "@/api/baseApi";

export const followUser = (userId: string) =>
  api.post(`/users/${userId}/follow`);

export const unfollowUser = (userId: string) =>
  api.post(`/users/${userId}/unfollow`);