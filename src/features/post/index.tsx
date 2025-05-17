import PostInfo from "./components/PostInfo";
import PostAssets from "./components/PostAssets";
import PostArtist from "./components/PostArtist";
import PostComments from "./components/PostComments";
import { fetchPost } from "./api/post.api";
import { fetchComments } from "./api/comment.api.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PostTags from "./components/PostTags";
// import PostMoreByArtist from "./components/PostMoreByArtist";
// import PostShare from "./components/PostShare";
import LoadingSpinner from "@/components/fallbacks/LoadingSpinner.tsx";
import { mappedCategoryPost } from "@/lib/utils";

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["postData", postId],
    queryFn: async () => {
      const response = await fetchPost(parseInt(postId!));
      console.log("fetchPost", response.data);
      const formattedData = mappedCategoryPost(response.data); // Convert BE type to FE type
      return formattedData;
    },
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      return await fetchComments(parseInt(postId!));
    },
    enabled: !!postId, // Ensure postId is available before fetching comments
  });
  console.log(comments);
  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="m-4 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (postError || commentsError) {
    return <div>Failed to fetch data.</div>;
  }

  const PostContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <PostInfo postData={postData!} />
        <PostComments comments={comments!} postId={postData!.id} />
        <PostTags categories={postData!.categories} />
        {/* <PostMoreByArtist artist={postData!.user} /> */}
        {/* <PostShare /> */}
      </div>
    );
  };

  return (
    <div className="flex-grow bg-mountain-50 py-4 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar">
      <div className="md:hidden flex flex-col gap-4 p-4">
        <PostArtist artist={postData!.user} postData={postData!} />
        <PostAssets medias={postData!.medias} />
        <PostContent />
      </div>
      <div className="hidden md:flex flex-row h-full">
        <div className="flex flex-grow justify-center items-center pl-4 h-full overflow-y-scroll no-scrollbar">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="flex-shrink-0 py-0 pr-4 pl-8 sm:w-[256px] md:w-[384px] lg:w-[448px] overflow-y-scroll no-scrollbar">
          <PostArtist artist={postData!.user} postData={postData!} />
          <PostContent />
        </div>
      </div>
    </div>
  );
};

export default Post;
