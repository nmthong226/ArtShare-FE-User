import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//Components
import { Button, Tooltip } from "@mui/material";
import BlogComments from "./components/BlogComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Blog } from "@/types/blog";
//Icons
import { IoPersonAddOutline } from "react-icons/io5";
import { LuTableOfContents } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";
import RelatedBlogs from "./components/RelatedBlogs";
import { BiComment } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { MdBookmarkBorder } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import Share from "@/components/dialogs/Share";
import { LikesDialog } from "@/components/like/LikesDialog";
import { fetchBlogDetails } from "./api/blog";
import { formatDistanceToNow } from "date-fns";

const BlogDetails = () => {
  const { blogId } = useParams<{ blogId: string }>(); // get blogId from URL
  const [showAuthorBadge, setShowAuthorBadge] = useState(false);
  // states for the likes dialog
  const [likesDialogOpen, setLikesDialogOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(14);
  const [isLiked, setIsLiked] = useState(false);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowAuthorBadge(scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenLikesDialog = () => {
    setLikesDialogOpen(true);
  };

  const handleCloseLikesDialog = () => {
    setLikesDialogOpen(false);
  };

  // Function to handle toggling like status
  const handleToggleLike = () => {
    // Toggle like status
    setIsLiked(!isLiked);

    // Update like count based on the new state
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  useEffect(() => {
    if (!blogId) return;

    setLoading(true);
    fetchBlogDetails(Number(blogId))
      .then((data) => {
        setBlog(data);
      })
      .catch((err) => {
        console.error("Failed to load blog:", err);
        setError("Could not load blog details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  if (!blog) return null;

  // 5) Compute reading time:
  const readingTime = Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex w-full h-full">
        <div className="relative flex flex-col w-[20%]">
          <div className="top-110 z-10 sticky flex justify-center items-center bg-white shadow-md mr-4 ml-auto rounded-full w-12 h-12">
            <LuTableOfContents className="size-5" />
          </div>
          <div className="right-4 bottom-4 z-50 fixed flex justify-center items-center bg-blue-400 shadow-md rounded-full w-12 h-12">
            <IoIosArrowUp className="mb-1 size-5 text-white" />
          </div>
        </div>
        <div className="group flex flex-col space-y-4 bg-white/50 shadow p-4 w-[60%]">
          <div className="flex space-x-2 w-full">
            <Link to="/blogs" className="underline">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-mountain-600 line-clamp-1">{blog.title}</span>
          </div>
          <h1 className="font-medium text-3xl">{blog.title}</h1>{" "}
          <div className="flex items-center space-x-2 text-mountain-600 text-sm">
            <p>
              Posted{" "}
              {formatDistanceToNow(new Date(blog.created_at), {
                addSuffix: true,
              })}
            </p>
            <span>•</span>
            <p>{readingTime}m reading</p>
          </div>
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 to-purple-100 shadow-sm p-2 py-4 rounded-lg">
            <div className="flex space-x-2">
              <Avatar>
                <AvatarImage src={blog.user.profile_picture_url ?? undefined} />
                <AvatarFallback>
                  {blog.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-between">
                <p>{blog.user.full_name || blog.user.username}</p>
                <p className="text-mountain-600 text-sm">
                  @{blog.user.username}
                </p>
              </div>
            </div>
            <Button className="flex items-center bg-white shadow w-32 h-12 font-thin text">
              <IoPersonAddOutline className="mr-2 size-4" />
              <p>Follow</p>
            </Button>
          </div>
          <div
            className="prose lg:prose-xl max-w-none p-2 rounded-md" // Added prose classes for styling
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
        <div className="relative flex flex-col w-[20%]">
          <div
            className={`${!showAuthorBadge ? "opacity-0 pointer-events-none" : "opacity-100"} space-y-2 flex-col transition ease-in-out duration-300 top-64 z-10 sticky flex justify-center items-center mr-auto ml-4 rounded-full w-14 h-76`}
          >
            <div className="relative flex justify-center items-center w-12 h-12">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Tooltip title="Follow" placement="right" arrow>
                <div className="-right-1 -bottom-1 absolute flex justify-center items-center bg-blue-400 border border-white rounded-full w-5 h-5">
                  <LuPlus className="text-white" />
                </div>
              </Tooltip>
            </div>
            <div
              className={`space-y-2 flex-col transition ease-in-out duration-300 flex justify-between items-center py-1 bg-white shadow-md rounded-full h-full w-full`}
            >
              <Tooltip title="Like" placement="right" arrow>
                <div className="flex justify-center items-center bg-blue-50 hover:bg-blue-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                  <AiOutlineLike
                    className={`size-5 ${isLiked ? "text-blue-500" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleToggleLike();
                    }} // Add onClick to toggle like
                  />
                  <p
                    className="ml-1 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleOpenLikesDialog();
                    }} // Add onClick to just the number to open dialog
                  >
                    {likeCount}
                  </p>
                </div>
              </Tooltip>
              <Tooltip title="Comment" placement="right" arrow>
                <div className="flex justify-center items-center bg-green-50 hover:bg-green-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                  <BiComment className="mr-1 size-4" />
                  <p>5</p>
                </div>
              </Tooltip>
              <Tooltip title="Save" placement="right" arrow>
                <div className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                  <MdBookmarkBorder className="size-4" />
                </div>
              </Tooltip>
              <Share
                tooltipDirection="right"
                link="http://localhost:5173/blogs/ambessa-arcane-fan-art"
                className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <BlogComments />
      <RelatedBlogs />
      <LikesDialog
        contentId={Number(blogId)} // pass contentId from URL
        open={likesDialogOpen}
        onClose={handleCloseLikesDialog}
      />
    </div>
  );
};

export default BlogDetails;