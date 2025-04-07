export interface Media {
  id: number;
  post_id: number;
  media_type: MediaType;
  description?: string;
  url: string;
  creator_id: number;
  downloads: number;
  created_at: Date;
}
