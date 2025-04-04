import { MEDIA_TYPE } from "@/constants";
import { Category, Post, User, Media } from "@/types";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACKEND_URL;

// enum MEDIA_TYPE {
//   IMAGE = "image",
//   VIDEO = "video",
// }

const mediaData: Media[] = [
  {
    mediaType: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742275346989-2d696fa2c9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHw0OXx8fHx8fHx8MTc0MjYzNjg1MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creatorId: 1,
    downloads: 100,
    createdAt: new Date(),
  },
  {
    mediaType: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742414348816-fe5f76446808?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHwxM3x8fHx8fHx8MTc0MjYxMTQ2MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creatorId: 1,
    downloads: 100,
    createdAt: new Date(),
  },
  {
    mediaType: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742470523391-891944f4155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHwxNHx8fHx8fHx8MTc0MjYxMTQ2MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creatorId: 1,
    downloads: 100,
    createdAt: new Date(),
  },
];

const userData: User = {
  userId: 1,
  username: "michael_guimont",
  fullName: "Michael Guimont",
  profilePictureUrl: "example.com/profile.jpg",
};

const categoryData: Category[] = [
  {
    id: 1,
    name: "Illustration",
    cateName: "Art",
    url: "example.com/category/art",
    createdAt: new Date(),
  },
];

const postData: Post = {
  id: 1,
  title: "Caro & Max's train robbers family",
  description:
    "Here is a poster illustration I did for a couple, friends of mine! They're celebrating their 20 years of being in a relationship together and asked me if I could make them something special for the occasion. Since the husband is working as a train conductor, I thought it would be appropriate to have their family as train robbers :p Hope you like",
  is_published: true,
  is_private: false,
  like_count: 53,
  share_count: 12,
  comment_count: 2,
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  medias: mediaData,
  user: userData,
  categories: categoryData,
};

const api = axios.create({
  baseURL: BACK_END_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const fetchPost = async (postId: number) => {
  // return await api.get<Post>(`?postId=${postId}`);
  return { data: postData };
};

export const fetchPosts = async (
  artistUsername: string,
  page: number,
  pageSize: number = 10
) => {
  // return await api.get<Post[]>(`?username${artistUsername}?page=${page}?pageSize=${pageSize}`);
  return {
    data: Array.from({ length: 9 }).map(() => postData),
  };
};
