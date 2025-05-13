export interface LikingUser {
  id: string;
  username: string;
  full_name: string | null;
  profile_picture_url: string | null;
  is_following?: boolean;
}

export interface LikeApiResponseItem {
  user: LikingUser;

  created_at?: string;
}
