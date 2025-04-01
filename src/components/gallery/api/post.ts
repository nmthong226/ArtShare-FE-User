import { Post } from "@/types";
import axios from "axios";
import api from "@/api/baseApi";

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

export const fetchPosts = async (
  page: number,
  tab?: string,
  query?: string,
  filter?: string[],
  pageSize: number = 12
): Promise<Post[]> => {
  try {
    if (query || filter && filter.length > 0) {
      console.log(`/posts/search?q=${query}&page=${page}&page_size=${pageSize}`)
      const response = await api.get<Post[]>(
        `/posts/search?q=${query}&page=${page}&page_size=${pageSize}`
      );
      return response.data;
    } else {
      console.log(`/posts/${tab}?page=${page}&page_size=${pageSize}`)
      const response = await api.get<Post[]>(
        `/posts/${tab}?page=${page}&page_size=${pageSize}`
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // const response = await fetchPhotos(page);
  // const photos = response.data.map((photo) => photo.urls.regular);
  // return mockPosts(photos) ;
};

export const fetchPhotoById = (id: string) =>
  unsplashAPI.get<UnsplashPhoto>(`/photos/${id}`);
