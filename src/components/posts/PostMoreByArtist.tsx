import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./api/post";

const PostMoreByArtist = ({ artist }: { artist: User }) => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", artist.username],
    retry: 2,
    queryFn: async () => {
      const response = await fetchPosts(artist.username, 1);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to fetch post data.</div>;
  }

  return (
    <div className="flex flex-col gap-4 bg-white px-4 py-6 rounded-2xl">
      <div className="font-bold text-xl">More by {artist.full_name || "Mock User"}</div>
      <div className="gap-4 grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 bg-white rounded-2xl">
        {posts?.map((post) => (
          <img
            key={post.id}
            src={post.medias[0].url}
            alt={post.medias[0].description}
            className="rounded aspect-[1/1]"
          />
        ))}
      </div>
    </div>
  );
};

export default PostMoreByArtist;