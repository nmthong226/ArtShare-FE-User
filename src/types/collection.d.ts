export interface Collection {
  id: number;
  name: string;
  description?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  posts: Post[];
}
