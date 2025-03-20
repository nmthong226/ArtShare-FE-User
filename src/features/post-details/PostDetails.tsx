import PostInfo from "@/components/post/PostInfo";

const PostDetails: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-grow bg-amber-200">123</div>
      <div className="sm:w-full md:w-[448px] bg-amber-50">
        <PostInfo />
      </div>
    </div>
  );
};

export default PostDetails;
