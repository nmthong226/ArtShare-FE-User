/* src/features/blog-details/BlogDetails.tsx */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AxiosError } from "axios";

import BlogComments from "./components/BlogComments";
import RelatedBlogs from "./components/RelatedBlogs";
import { fetchBlogDetails } from "./api/blog";
import { fetchBlogComments } from "../post/api/comment.api"; // <-- 🆕
import { createLike, removeLike } from "./api/like-blog";
import {
  followUser,
  unfollowUser,
} from "../user-profile-public/api/follow.api";

import { useUser } from "@/contexts/UserProvider";
import { useSnackbar } from "@/contexts/SnackbarProvider";

import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { IoPersonAddOutline } from "react-icons/io5";

import { IoIosArrowUp } from "react-icons/io";
import { MdBookmarkBorder } from "react-icons/md";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikesDialog } from "@/components/like/LikesDialog";
import type { Blog } from "@/types/blog";
import { TargetType } from "@/types/likes";

const BlogDetails: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();

  /* ───────── blog query ───────── */
  const {
    data: blog,
    isLoading: blogLoading,
    error: blogError,
    refetch: refetchBlog,
  } = useQuery<Blog>({
    queryKey: ["blogDetails", blogId],
    queryFn: () => fetchBlogDetails(Number(blogId)),
    enabled: !!blogId,
  });

  /* ───────── comments query ───────── */
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["blogComments", blogId],
    queryFn: () => fetchBlogComments(Number(blogId)),
    enabled: !!blogId,
  });

  /* comment count derived from list */
  const [commentCount, setCommentCount] = useState(0);
  useEffect(() => setCommentCount(comments.length), [comments]);

  /* ───────── follow mutations ───────── */
  const followMutation = useMutation({
    mutationFn: () => followUser(blog!.user.id),
    onSuccess: () => refetchBlog(),
    onError: (e: unknown) =>
      showSnackbar(
        e instanceof AxiosError && e.response?.data?.message
          ? e.response.data.message
          : "Failed to follow user.",
        "error",
      ),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(blog!.user.id),
    onSuccess: () => refetchBlog(),
    onError: (e: unknown) =>
      showSnackbar(
        e instanceof AxiosError && e.response?.data?.message
          ? e.response.data.message
          : "Failed to unfollow user.",
        "error",
      ),
  });

  /* ───────── like mutations ───────── */
  const likeMutation = useMutation({
    mutationFn: () =>
      createLike({ target_id: Number(blogId), target_type: TargetType.BLOG }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] }),
    onError: (e: unknown) =>
      showSnackbar(
        e instanceof AxiosError && e.response?.data?.message
          ? e.response.data.message
          : "Failed to like blog.",
        "error",
      ),
  });

  const unlikeMutation = useMutation({
    mutationFn: () =>
      removeLike({ target_id: Number(blogId), target_type: TargetType.BLOG }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] }),
    onError: (e: unknown) =>
      showSnackbar(
        e instanceof AxiosError && e.response?.data?.message
          ? e.response.data.message
          : "Failed to unlike blog.",
        "error",
      ),
  });

  /* ───────── derived state ───────── */
  const isOwnProfile = user?.id === blog?.user.id;
  const isFollowing = blog?.user.is_following;
  const isLiked = blog?.isLikedByCurrentUser ?? false;
  const likeCount = blog?.like_count ?? 0;
  const readingTime = blog
    ? Math.ceil(blog.content.split(/\s+/).length / 200)
    : 0;

  /* ───────── toolbar scroll badge ───────── */
  const [showBadge, setShowBadge] = useState(false);
  useEffect(() => {
    const handler = () => setShowBadge(window.scrollY > 150);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ───────── handlers ───────── */
  const toggleFollow = () => {
    if (!user) return showSnackbar("Please login to follow", "warning");
    isFollowing ? unfollowMutation.mutate() : followMutation.mutate();
  };

  const toggleLike = () => {
    if (!user) return showSnackbar("Please login to like", "warning");
    isLiked ? unlikeMutation.mutate() : likeMutation.mutate();
  };

  const handleCommentAdded = () => {
    setCommentCount((c) => c + 1);
    refetchComments();
  };
  const handleCommentDeleted = () => {
    setCommentCount((c) => Math.max(c - 1, 0));
    refetchComments();
  };

  /* ───────── loading / error ───────── */
  if (blogLoading || commentsLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  if (blogError || commentsError)
    return (
      <div className="p-4 text-red-500">
        {(blogError || commentsError)?.message}
      </div>
    );
  if (!blog) return null;

  /* ───────── JSX ───────── */
  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* === top section and article body (omitted parts unchanged) === */}
      <div className="group flex flex-col space-y-4 bg-white/50 shadow p-4 w-[60%]">
        {/* breadcrumbs */}
        <div className="flex space-x-2">
          <Link to="/blogs" className="underline">
            Blogs
          </Link>
          <span>/</span>
          <span className="text-mountain-600 line-clamp-1">{blog.title}</span>
        </div>
        <h1 className="font-medium text-3xl">{blog.title}</h1>
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

        {/* author card ... (unchanged) */}

        <div
          className="p-2 rounded-md max-w-none prose lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* === right floating actions === */}
      <div className="fixed right-4 top-64 space-y-3">
        <Tooltip title={isLiked ? "Unlike" : "Like"} arrow>
          <div
            className="flex items-center bg-blue-50 hover:bg-blue-100 p-2 rounded-full cursor-pointer"
            onClick={toggleLike}
          >
            {isLiked ? (
              <AiFillLike className="text-blue-500" />
            ) : (
              <AiOutlineLike />
            )}
            <span className="ml-1">{likeCount}</span>
          </div>
        </Tooltip>
        <Tooltip title="Comments" arrow>
          <div className="flex items-center bg-green-50 p-2 rounded-full">
            <BiComment className="mr-1" />
            <span>{commentCount}</span>
          </div>
        </Tooltip>
      </div>

      {/* === comments & related === */}
      <BlogComments
        blogId={Number(blogId)}
        comments={comments}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />

      <RelatedBlogs />

      <LikesDialog contentId={Number(blogId)} open={false} onClose={() => {}} />
    </div>
  );
};

export default BlogDetails;
