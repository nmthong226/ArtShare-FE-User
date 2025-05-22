import React, { useEffect, useRef, useState, forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Button,
  CircularProgress,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import { BiDotsVertical } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { SendHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  fetchComments,
  createComment,
  likeComment,
  unlikeComment,
  deleteComment,
} from "../api/comment.api";

import { useUser } from "@/contexts/UserProvider";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import type { CommentUI } from "@/types/comment";
import { Link } from "react-router-dom";

type Props = {
  blogId: number;
  comments: CommentUI[];
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
};

const BlogComments = forwardRef<HTMLDivElement, Props>(
  ({ comments: initial, blogId, onCommentAdded, onCommentDeleted }, _ref) => {
    const { user } = useUser();
    const { showSnackbar } = useSnackbar();
    const [comments, setComments] = useState<CommentUI[]>(initial);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /* ───────── create comment ───────── */
    const handleAddComment = async () => {
      const content = newComment.trim();
      if (!content) return;
      if (!user) {
        showSnackbar?.("Please login to comment", "warning");
        return;
      }

      const tmpId = Date.now();
      const optimistic: CommentUI = {
        id: tmpId,
        user_id: user.id,
        parent_comment_id: null,
        target_id: blogId,
        target_type: "BLOG",
        content,
        created_at: new Date(),
        updated_at: new Date(),
        like_count: 0,
        likedByCurrentUser: false,
        user: {
          id: user.id,
          username: user.username,
          profile_picture_url: user.profile_picture_url,
          full_name: user.full_name,
          followers_count: 0,
          email: "",
          created_at: user.created_at,
          followings_count: user.followings_count,
          is_onboard: user.is_onboard,
        },
        replies: [],
      };

      setComments((prev) => [optimistic, ...prev]);
      setNewComment("");
      onCommentAdded();

      try {
        const { data } = await createComment({
          content,
          target_id: blogId,
          target_type: "BLOG",
        });
        setComments((prev) => prev.map((c) => (c.id === tmpId ? data : c)));
      } catch (e) {
        showSnackbar?.("Failed to post comment", "error");
        setComments((prev) => prev.filter((c) => c.id !== tmpId));
        onCommentDeleted();
      }
    };

    /* ───────── like / unlike ───────── */
    const toggleLike = async (id: number) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                likedByCurrentUser: !c.likedByCurrentUser,
                like_count: c.like_count + (c.likedByCurrentUser ? -1 : 1),
              }
            : c,
        ),
      );

      try {
        const target = comments.find((c) => c.id === id);
        if (target?.likedByCurrentUser) {
          await unlikeComment(id);
        } else {
          await likeComment(id);
        }
      } catch {
        // rollback
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  likedByCurrentUser: !c.likedByCurrentUser,
                  like_count: c.like_count + (c.likedByCurrentUser ? -1 : 1),
                }
              : c,
          ),
        );
      }
    };

    /* ───────── delete comment ───────── */
    const handleDelete = async (id: number) => {
      const backup = comments;
      setComments((prev) => prev.filter((c) => c.id !== id));
      onCommentDeleted();
      try {
        await deleteComment(id);
      } catch {
        setComments(backup);
        onCommentAdded();
        showSnackbar?.("Failed to delete", "error");
      }
    };

    /* ───────── UI ───────── */
    return (
      <div className="flex flex-col items-center bg-white shadow px-4 py-8 w-[60%] mt-8 space-y-6">
        {/* header */}
        <div className="flex items-center space-x-2 w-full">
          <span className="font-medium text-lg">
            {comments.length} Comments
          </span>
        </div>

        {/* add comment box */}
        {user ? (
          <div className="flex items-start space-x-3 w-full">
            <Avatar>
              <AvatarImage src={user.profile_picture_url ?? undefined} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-grow gap-2">
              <TextareaAutosize
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full border-2 border-mountain-200 rounded-md p-3 resize-none"
              />
              <Button
                disabled={!newComment.trim()}
                onClick={handleAddComment}
                variant="contained"
                className="min-w-[48px] h-[48px] p-0"
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-mountain-500 italic">
            Please&nbsp;
            <Link to="/login" className="underline text-blue-500">
              login
            </Link>{" "}
            to comment
          </p>
        )}

        <div className="flex flex-col space-y-4 w-full">
          {comments.map((c) => (
            <div key={c.id} className="flex flex-col w-full">
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={c.user.profile_picture_url ?? undefined} />
                  <AvatarFallback>
                    {c.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-mountain-600 space-x-1">
                    <span className="font-semibold">@{c.user.username}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(c.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p>{c.content}</p>
                </div>

                {user?.id === c.user.id && (
                  <Popover>
                    <PopoverTrigger className="hover:bg-mountain-100 rounded-full p-1">
                      <BiDotsVertical />
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-28 text-xs">
                      <div
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-2 hover:bg-mountain-50 cursor-pointer"
                      >
                        Delete
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-12">
                <div
                  onClick={() => toggleLike(c.id)}
                  className="flex items-center hover:bg-mountain-100 rounded-full w-8 h-8 justify-center cursor-pointer"
                >
                  <AiOutlineLike
                    className={`h-5 w-5 ${c.likedByCurrentUser ? "text-blue-600" : ""}`}
                  />
                </div>
                <span>{c.like_count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default BlogComments;
