import PostInfo from "@/components/post/PostInfo";
import PostAssets from "@/components/post/PostAssets";
import PostArtist from "@/components/post/PostArtist";
import PostComments from "@/components/post/PostComments";
import { fetchPost } from "@/components/post/api/postService";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import PostTags from "@/components/post/PostTags";
import PostMoreByArtist from "@/components/post/PostMoreByArtist";
import PostShare from "@/components/post/PostShare";

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const {
    data: postData,
    isLoading,
    error,
  } = useQuery("postData", async () => {
    const response = await fetchPost(parseInt(postId!));
    return response.data;
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
    <div className="temp-layout flex flex-col md:h-screen">
      <div className="navbar"></div>
      <div className="flex-grow bg-mountain-50 overflow-y-scroll no-scrollbar gap-4">
        <div className="flex md:hidden flex-col gap-4">
          <PostArtist artist={postData!.user} />
          <PostAssets medias={postData!.medias} />
          <PostContent />
        </div>
        <div className="hidden md:flex flex-row gap-4 h-full">
          <div className="h-full overflow-y-scroll no-scrollbar flex-grow">
            <PostAssets medias={postData!.medias} />
          </div>
          <div className="md:w-[256px] lg:w-[384px] xl:w-[448px] py-0 overflow-y-scroll no-scrollbar flex-shrink-0">
            <PostArtist artist={postData!.user} />
            <PostContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
