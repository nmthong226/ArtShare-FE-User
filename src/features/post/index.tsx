import PostInfo from "./components/PostInfo";
import PostAssets from "./components/PostAssets";
import PostArtist from "./components/PostArtist";
import PostComments from "./components/PostComments";
import { fetchPost } from "./api/post.api";
import { fetchComments } from "./api/comment.api.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import PostShare from "@/components/posts/PostShare";
import { mappedCategoryPost } from "@/lib/utils";
import { CircularProgress } from "@mui/material";

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
      <div className="flex m-4 text-center">
        <CircularProgress size={36} />
        <p>Loading...</p>
      </div>
    );
  }

  if (postError || commentsError) {
    return <div>Failed to fetch data.</div>;
  }

  return (
    <div className="relative flex-grow bg-mountain-50 dark:bg-gradient-to-b dark:from-mountain-1000 dark:to-mountain-950 p-4 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar dark:bg-mountain-950">
      <div className="md:hidden relative flex flex-col bg-white shadow p-4 rounded-2xl h-full">
        <div className="rounded-2xl h-full overflow-y-auto">
          <PostArtist artist={postData!.user} postData={postData!} />
          <PostAssets medias={postData!.medias} />
          <PostInfo postData={postData!} />
          <PostComments comments={comments!} postId={postData!.id} />
        </div>
      </div>
      <div className="hidden md:flex flex-row gap-4 h-full">
        <div className="flex flex-grow justify-center items-center h-full overflow-y-scroll no-scrollbar">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="relative flex-shrink-0 bg-white dark:bg-mountain-950 shadow py-0 pl-4 rounded-2xl sm:w-[256px] md:w-[384px] lg:w-[448px]">
          <div className="flex flex-col gap-4 rounded-2xl h-full overflow-y-scroll custom-scrollbar">
            <PostArtist artist={postData!.user} postData={postData!} />
            <PostInfo postData={postData!} />
            <PostComments comments={comments!} postId={postData!.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
