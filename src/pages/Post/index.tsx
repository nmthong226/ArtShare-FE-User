import PostInfo from "@/components/posts/PostInfo";
import PostAssets from "@/components/posts/PostAssets";
import PostArtist from "@/components/posts/PostArtist";
import PostComments from "@/components/posts/PostComments";
import { fetchPost } from "@/components/posts/api/post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PostTags from "@/components/posts/PostTags";
import PostMoreByArtist from "@/components/posts/PostMoreByArtist";
// import PostShare from "@/components/posts/PostShare";
import LoadingSpinner from "@/components/LoadingSpinner";
import { mappedCategoryPost } from "@/lib/utils";

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

  const PostContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <PostInfo postData={postData!} />
        <PostComments />
        <PostTags categories={postData!.categories} />
        <PostMoreByArtist artist={postData!.user} />
        {/* <PostShare /> */}
      </div>
    );
  };

  return (
    <div className="flex-grow bg-mountain-50 py-4 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar">
      {/* <div className="md:hidden flex flex-col gap-4 p-4">
        <PostArtist artist={postData!.user} />
        <PostAssets medias={postData!.medias} />
        <PostContent />
      </div> */}
      <div className="hidden md:flex flex-row h-full">
        <div className="flex flex-grow justify-center items-center pl-4 h-full overflow-y-scroll no-scrollbar">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="flex-shrink-0 py-0 pr-4 pl-8 sm:w-[256px] md:w-[384px] lg:w-[448px] overflow-y-scroll no-scrollbar">
          <PostArtist artist={postData!.user} />
          <PostContent />
        </div>
      </div>
    </div>
  );
};

export default Post;
