import PostInfo from "@/features/post/components/PostInfo";
import PostAssets from "@/features/post/components/PostAssets";
import PostArtist from "@/features/post/components/PostArtist";
import PostComments from "@/features/post/components/PostComments";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import PostShare from "@/components/posts/PostShare";
import LoadingSpinner from "@/components/LoadingSpinner";
import { mappedCategoryPost } from "@/lib/utils";
import { fetchPost } from "./api/post.api";

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
      const formattedData = mappedCategoryPost(response.data); // Convert BE type to FE type
      return formattedData;
    },
  });

  if (isLoading) {
    return (
      <div className="m-4 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div>Failed to fetch post data.</div>;
  }

  return (
    <div className="relative flex-grow bg-mountain-50 p-4 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar">
      <div className="md:hidden relative flex flex-col bg-white shadow p-4 rounded-2xl h-full">
        <div className="rounded-2xl h-full overflow-y-auto">
          <PostArtist artist={postData!.user} postData={postData!} />
          <PostAssets medias={postData!.medias} />
          <PostInfo postData={postData!} />
          <PostComments />
        </div>
      </div>
      <div className="hidden md:flex flex-row gap-4 h-full">
        <div className="flex flex-grow justify-center items-center h-full overflow-y-scroll no-scrollbar">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="relative flex-shrink-0 bg-white shadow py-0 pl-4 rounded-2xl sm:w-[256px] md:w-[384px] lg:w-[448px]">
          <div className="flex flex-col gap-4 rounded-2xl h-full overflow-y-scroll custom-scrollbar">
            <PostArtist artist={postData!.user} postData={postData!} />
            <PostInfo postData={postData!} />
            <PostComments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
