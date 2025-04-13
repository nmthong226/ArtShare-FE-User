import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineEye } from "react-icons/hi";

const posts = [
  {
    id: 2,
    username: "Jade",
    handle: "@itsjade",
    time: "19hr",
    text: "Testtttt",
    image: "/logo_app_v_101.png",
  },
  {
    id: 3,
    username: "Jade",
    handle: "@itsjade",
    time: "4d",
    text: "",
    image: "/logo_app_v_101.png",
  },
];

const UserPosts = () => {
  if (posts.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 text-sm">
        No posts available.
      </div>
    );
  }

  return (
    <div className="w-full p-1 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-10 gap-2">
      {posts.map((post) => (
        <Link
          component={RouterLink}
          to={`/posts/${post.id}`}
          key={post.id}
          className="aspect-w-1 aspect-h-1 relative overflow-hidden group transition-shadow duration-300 hover:shadow-[0_8px_12px_-4px_rgba(0,0,0,0.4)]"
          underline="none"
        >
          <img
            src={post.image}
            alt={post.text || post.username}
            className="object-cover w-full h-full transition-transform duration-300 "
          />

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-3">
            <div className="flex justify-between items-end w-full">
              <div>
                <p className="font-medium truncate">
                  {post.text || "Untitled"}
                </p>
                <p className="text-xs text-gray-300 truncate">
                  @{post.username}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">9</span>
                  <AiOutlineLike className="size-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">23</span>
                  <BiCommentDetail className="size-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">1k</span>
                  <HiOutlineEye className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserPosts;
