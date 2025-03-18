export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export interface Media {
  mediaType: MediaType;
  description?: string;
  url: string;
  creatorId: number;
  downloads: number;
  createdAt: Date;
}
