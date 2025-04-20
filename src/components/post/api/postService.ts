import { MEDIA_TYPE } from "@/constants";
import { Category, Post, User, Media } from "@/types";

const mediaData: Media[] = [
  {
    media_type: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742275346989-2d696fa2c9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHw0OXx8fHx8fHx8MTc0MjYzNjg1MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creator_id: 1,
    downloads: 100,
    created_at: new Date(),
    id: 1,
    post_id: 1,
  },
  {
    media_type: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742414348816-fe5f76446808?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHwxM3x8fHx8fHx8MTc0MjYxMTQ2MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creator_id: 1,
    downloads: 100,
    created_at: new Date(),
    id: 2,
    post_id: 1,
  },
  {
    media_type: MEDIA_TYPE.IMAGE,
    description: "Poster illustration",
    url: "https://images.unsplash.com/photo-1742470523391-891944f4155f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHwxNHx8fHx8fHx8MTc0MjYxMTQ2MHw&ixlib=rb-4.0.3&q=80&w=1080",
    creator_id: 1,
    downloads: 100,
    created_at: new Date(),
    id: 3,
    post_id: 1,
  },
];

const userData: User = {
  id: "1",
  username: "michael_guimont",
  email: "michael@example.com",
  profile_picture_url: "https://example.com/profile.jpg",
  bio: "Motion artist & illustrator",
  created_at: new Date(),
};

const categoryData: Category[] = [
  {
    id: 1,
    cateName: "Motion Graphics",
    urls: [
      "https://cdna.artstation.com/p/categories/example_images/000/000/134/thumb/fabian-vazquez-storyboard.jpg?1586719728",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/135/thumb/mike-howie-planetsidearena-logo-concepts-colour.jpg?1586719740",
      "https://cdna.artstation.com/p/categories/example_images/000/000/136/thumb/daniel-lugo-azuluz-3.jpg?1586719763",
      "https://cdna.artstation.com/p/categories/example_images/000/000/137/thumb/Screen%20Shot%202020-04-12%20at%203.30.39%20PM.png?1586719850",
    ],
    cateType: "ATTRIBUTE",
    cateDescription: "Artwork with a focus on animated graphics or text.",
    created_at: new Date(),
  },
];

const postData: Post = {
  id: 1,
  user_id: userData.id,
  title: "Caro & Max's train robbers family",
  description:
    "Here is a poster illustration I did for a couple, friends of mine! They're celebrating their 20 years of being in a relationship together and asked me if I could make them something special for the occasion. Since the husband is working as a train conductor, I thought it would be appropriate to have their family as train robbers :p Hope you like",
  is_published: true,
  is_private: false,
  like_count: 53,
  share_count: 12,
  comment_count: 2,
  view_count: 234,
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  medias: mediaData,
  user: userData,
  categories: categoryData,
  is_mature: false,
  ai_created: false,
  thumbnail_url:
    "https://images.unsplash.com/photo-1742275346989-2d696fa2c9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjU0NTh8MHwxfGFsbHw0OXx8fHx8fHx8MTc0MjYzNjg1MHw&ixlib=rb-4.0.3&q=80&w=1080",
};

export const fetchPosts = async (
  artistUsername: string,
  page: number,
  pageSize: number = 10,
) => {
  console.log(
    `Fetching posts for ${artistUsername} on page ${page} with page size ${pageSize}`,
  );
  // return await api.get<Post[]>(`?username${artistUsername}?page=${page}?pageSize=${pageSize}`);
  return {
    data: Array.from({ length: 9 }).map(() => postData),
  };
};
