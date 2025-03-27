export interface Media {
  mediaType: MediaType;
  description?: string;
  url: string;
  creatorId: number;
  downloads: number;
  createdAt: Date;
}
