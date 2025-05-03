import { Link as RouterLink, useParams } from "react-router-dom";
import Link from "@mui/material/Link";
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineEye } from "react-icons/hi";
import { useEffect, useState } from "react";
import { fetchUserPosts } from "../api/get-posts-by-user";
import { Post } from "@/types";
import { Box, CircularProgress, Typography } from "@mui/material";

const UserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        setLoadingPosts(true);
        const userPosts = await fetchUserPosts(username, 1);
        console.log("@@ User posts", userPosts);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    })();
  }, [username]);

  if (!username) return null;

  if (loadingPosts) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <Typography variant="body2" color="textSecondary">
          No posts available.
        </Typography>
      </Box>
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
            src={post.thumbnail_url}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-300"
          />

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-3">
            <div className="flex justify-between items-end w-full">
              <div>
                <p className="font-medium truncate">
                  {post.title || "Untitled"}
                </p>
                <p className="text-xs text-gray-300 break-words whitespace-normal">
                  @{username}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">{post.like_count}</span>
                  <AiOutlineLike className="size-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">{post.comment_count}</span>
                  <BiCommentDetail className="size-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">
                    {post.view_count || "X"}
                  </span>
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
