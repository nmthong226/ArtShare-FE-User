import axios from "axios";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;

export interface UnsplashPhoto {
  id: string;
  urls: { regular: string };
  user: { name: string; username: string };
  current_user_collections: { title: string };
  links: { html: string };
  description?: string;
  alt_description?: string;
}

const unsplashAPI = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

export const fetchPhotos = (page = 1) =>
  unsplashAPI.get<UnsplashPhoto[]>("/photos", {
    params: {
      page,
      per_page: 12,
    },
  });

export const fetchPhotoById = (id: string) => unsplashAPI.get<UnsplashPhoto>(`/photos/${id}`);
