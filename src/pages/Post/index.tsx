import PostInfo from "@/components/posts/PostInfo";
import PostAssets from "@/components/posts/PostAssets";
import PostArtist from "@/components/posts/PostArtist";
import PostComments from "@/components/posts/PostComments";
import { fetchPost } from "@/components/posts/api/post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PostTags from "@/components/posts/PostTags";
import PostMoreByArtist from "@/components/posts/PostMoreByArtist";
import PostShare from "@/components/posts/PostShare";

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const {
    data: postData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postData", postId],
    queryFn: async () => {
      const response = await fetchPost(parseInt(postId!));
      console.log("fetchPost", response.data);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to fetch post data.</div>;
  }

  const PostContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <PostInfo postData={postData!} />
        <PostComments />
        <PostTags />
        <PostMoreByArtist artist={postData!.user} />
        <PostShare />
      </div>
    );
  };

  return (
    <div className="flex-grow bg-mountain-50 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar py-4">
      <div className="md:hidden flex flex-col gap-4 p-4">
        <PostArtist artist={postData!.user} />
        <PostAssets medias={postData!.medias} />
        <PostContent />
      </div>
      <div className="hidden md:flex flex-row h-full">
        <div className="flex-grow h-full overflow-y-scroll no-scrollbar pl-4">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="flex-shrink-0 py-0 sm:w-[256px] md:w-[384px] lg:w-[448px] overflow-y-scroll no-scrollbar pl-8 pr-4">
          <PostArtist artist={postData!.user} />
          <PostContent />
        </div>
      </div>
    </div>
  );
};

export default Post;
