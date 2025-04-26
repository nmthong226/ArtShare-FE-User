import PostInfo from "@/features/post/components/PostInfo";
import PostAssets from "@/features/post/components/PostAssets";
import PostArtist from "@/features/post/components/PostArtist";
import PostComments from "@/features/post/components/PostComments";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
// import PostShare from "@/components/posts/PostShare";
import LoadingSpinner from "@/components/LoadingSpinner";
import { mappedCategoryPost } from "@/lib/utils";
import { fetchPost } from "./mocks/api";
import { IconButton } from "@mui/material";
import { FiX as CloseIcon } from "react-icons/fi";

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
  const navigate = useNavigate();

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
    <div className="flex-grow bg-mountain-50 p-4 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar relative">
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/explore");
        }}
        className="absolute top-7 right-7 z-20 text-white bg-mountain-500 hover:bg-mountain-700"
      >
        <CloseIcon fontSize={20} />
      </IconButton>
      <div className="relative md:hidden flex flex-col bg-white shadow p-4 rounded-2xl h-full">
        <div className="h-full overflow-y-scroll no-scrollbar rounded-2xl">
          <PostArtist artist={postData!.user} />
          <PostAssets medias={postData!.medias} />
          <PostInfo postData={postData!} />
          <PostComments />
        </div>
      </div>
      <div className="hidden md:flex flex-row h-full gap-4">
        <div className="flex flex-grow justify-center items-center h-full overflow-y-scroll no-scrollbar">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="relative flex-shrink-0 py-0 sm:w-[256px] md:w-[384px] lg:w-[448px] bg-white shadow p-4 rounded-2xl ">
          <div className="h-full overflow-y-scroll no-scrollbar rounded-2xl gap-4 flex flex-col">
            <PostArtist artist={postData!.user} />
            <PostInfo postData={postData!} />
            <PostComments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
