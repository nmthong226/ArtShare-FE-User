export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  full_name?: string;
  profile_picture_url?: string | null;
  bio?: string | null;
  created_at: Date;
  updated_at?: Date | null;
  refresh_token?: string | null;
  roles?: UserRole[];
  comments?: Comment[];
  followers?: Follow[];
  followings?: Follow[];
  likes?: Like[];
  posts?: Post[];
  blogs?: Blog[];
  shares?: Share[];
  bookmarks?: Bookmark[];
  ratings?: Rating[];
}
