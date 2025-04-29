export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  profile_picture_url?: string;
  bio?: string;
  created_at?: Date;
  updated_at?: Date;
  refresh_token?: string;
  followers_count?: number;
  following_count?: number;

  //   posts: Post[];

  //   likes: Like[];
  //   comments: Comment[];
  //   shares: Share[];

  //   followers: Follow[];
  //   followings: Follow[];
}
