import axios from "axios";
import { Photo } from "@/interfaces/Photo";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;

const unsplashAPI = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

export const fetchPhotos = (page = 1) =>
  unsplashAPI.get<Photo[]>("/photos", {
    params: {
      page,
      per_page: 12,
    },
  });

export const fetchPhotoById = (id: string) => unsplashAPI.get<Photo>(`/photos/${id}`);
