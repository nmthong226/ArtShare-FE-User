import { Post } from "@/types";
import { MediaType } from "@/types/media";
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

const mockPosts = (photos: string[]): Post[] => {
  const posts: Post[] = [];
  let toggleSingleImagePost = true;

  for (let i = 0; i < photos.length; ) {
    const images = toggleSingleImagePost
      ? photos.slice(i, i + 1) // Single-image post
      : photos.slice(i, i + 3); // Multi-image post

    if (images.length > 0) {
      posts.push({
        id: i,
        title: `Post ${posts.length + 1}`,
        user: { fullName: `Author ${posts.length + 1}`, username: `author-${posts.length + 1}`, profilePictureUrl: "" },
        medias: images.map((url) => ({ url, mediaType: MediaType.IMAGE, creatorId: i, downloads: 0, createdAt: new Date() })),
        categories: [],
        is_published: true,
        is_private: false,
        like_count: 0,
        share_count: 0,
        comment_count: 0,
        created_at: new Date(),
      });
    }

    i += images.length;

    toggleSingleImagePost = !toggleSingleImagePost;
  }

  return posts;
};

export const fetchPhotos = (page = 1) =>
  unsplashAPI.get<UnsplashPhoto[]>("/photos", {
    params: {
      page,
      per_page: 12,
    },
  });

export const fetchPosts = async (filter: string, page: number) => {
  const endpoint = filter === "for-you" ? "/posts/trending" : "/posts/following";
  console.log("fetchPosts", endpoint);
  // return await axios.get<Post[]>(`${endpoint}`);

  const response = await fetchPhotos(page);
  const photos = response.data.map((photo) => photo.urls.regular);
  return { data: mockPosts(photos) };
};

export const fetchPhotoById = (id: string) => unsplashAPI.get<UnsplashPhoto>(`/photos/${id}`);
