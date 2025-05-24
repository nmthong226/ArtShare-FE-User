export interface Blog {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  is_published: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  updated_at: string | null;
  average_rating: number;
  is_protected: boolean;
  rating_count: number;
  pictures: string[];
  embedded_videos: string[];
  view_count: number;
  isLikedByCurrentUser: boolean;
  user: {
    id: string;
    username: string;
    full_name?: string | null;
    profile_picture_url?: string | null;
    followers_count: number;
    is_following: boolean;
  };
}
