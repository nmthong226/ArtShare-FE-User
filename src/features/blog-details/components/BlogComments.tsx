import React, { useEffect, useRef, useState } from "react";

// UI components -------------------------------------------------------------
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
} from "@mui/material";

// Icons ---------------------------------------------------------------------
import { BiDotsVertical } from "react-icons/bi";
import { IoFilter, IoPersonRemoveOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { SendHorizontal } from "lucide-react";

// Types / utils -------------------------------------------------------------
import {
  CommentUI,
  Comment,
  CreateCommentDto,
  TargetType,
} from "@/types/comment";
import { formatDate } from "@/lib/utils";

// Converts a Comment to CommentUI (add more fields as needed)
function toCommentUI(comment: Comment): CommentUI {
  return {
    ...comment,
    created_at: new Date(comment.created_at),
    updated_at: new Date(comment.updated_at),
    replies: comment.replies?.map(toCommentUI) ?? [],
  };
}

// API helpers ---------------------------------------------------------------
import { fetchComments, createComment } from "../api/comment.api"; // adjust path if placed elsewhere

/* -------------------------------------------------------------------------- */
/*                              Component Props                               */
/* -------------------------------------------------------------------------- */
interface BlogCommentsProps {
  blogId: number;
  targetType?: TargetType; // default "BLOG"
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */
const BlogComments: React.FC<BlogCommentsProps> = ({
  blogId,
  targetType = "BLOG",
}) => {
  // State -------------------------------------------------------------------
  const [order, setOrder] = useState<"recent" | "top">("recent");
  const [comments, setComments] = useState<CommentUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch comments ----------------------------------------------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data: Comment[] = await fetchComments(blogId);
        if (!mounted) return;
        const ui = data.map(toCommentUI);
        setComments(sort(ui, order));
      } catch (err) {
        if (mounted) setError("Failed to load comments.");
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [blogId, targetType, order]);

  // Helpers -----------------------------------------------------------------
  const sort = (list: CommentUI[], by: "recent" | "top") => {
    const arr = [...list];
    return by === "recent"
      ? arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
      : arr.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  };

  const handleOrderChange = (e: SelectChangeEvent) =>
    setOrder(e.target.value as "recent" | "top");

  // Submit comment ----------------------------------------------------------
  const handleSend = async () => {
    if (sending) return;
    const content = inputRef.current?.value.trim() || "";
    if (!content) return;

    // Optimistic UI ---------------------------------------------------------
    const tempId = Math.random();
    const optimistic: CommentUI = {
      id: tempId,
      user_id: "me",
      user: {
        id: "me",
        username: "me",
        email: "me@example.com",
        profile_picture_url: "",
        created_at: new Date(),
        followers_count: 0,
        followings_count: 0,
      },
      parent_comment_id: null,
      target_id: blogId,
      target_type: targetType,
      content,
      created_at: new Date(),
      updated_at: new Date(),
      replies: [],
      likes: 0,
      likedByUser: false,
    };

    setComments((prev) => sort([optimistic, ...prev], order));
    inputRef.current!.value = "";
    setSending(true);

    const payload: CreateCommentDto = {
      content,
      target_id: blogId,
      target_type: targetType,
    };

    try {
      const created = await createComment(payload);
      const createdUI = toCommentUI(created.data);
      setComments((prev) => prev.map((c) => (c.id === tempId ? createdUI : c)));
    } catch (err) {
      console.error(err);
      setError("Failed to send comment.");
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------ Render ----------------------------------- */
  return (
    <div className="mt-8 flex w-full max-w-4xl flex-col items-center space-y-8 rounded-lg bg-white px-4 py-8 shadow">
      {/* Header ------------------------------------------------------------- */}
      <div className="flex w-full items-center gap-2">
        <span className="text-lg font-medium">{comments.length} Comments</span>
        <FormControl sx={{ m: 1, minWidth: 140 }}>
          <Select
            size="small"
            value={order}
            onChange={handleOrderChange}
            renderValue={() =>
              order === "recent" ? "Recent Comments" : "Top Comments"
            }
            MenuProps={{ disableScrollLock: true }}
            className="relative pl-6"
          >
            <MenuItem value="recent">Recent Comments</MenuItem>
            <MenuItem value="top">Top Comments</MenuItem>
          </Select>
          <IoFilter className="absolute left-2 top-1/2 -translate-y-1/2" />
        </FormControl>
      </div>

      {/* Input -------------------------------------------------------------- */}
      <div className="flex w-full items-start gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>

        <TextareaAutosize
          ref={inputRef}
          placeholder="Add a comment"
          className="flex-1 resize-none rounded-md border-2 border-mountain-200 px-4 py-2"
          minRows={1}
        />

        <Button
          variant="contained"
          disabled={sending}
          onClick={handleSend}
          className="aspect-square h-12 min-w-0 p-0.5"
        >
          <SendHorizontal />
        </Button>
      </div>

      {/* List --------------------------------------------------------------- */}
      {loading ? (
        <p className="text-sm text-mountain-500">Loading comments…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div className="flex w-full flex-col space-y-4">
          {comments.map((c) => (
            <CommentRow key={c.id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogComments;

/* -------------------------------------------------------------------------- */
/*                            Comment Row component                            */
/* -------------------------------------------------------------------------- */
const CommentRow: React.FC<{ comment: CommentUI }> = ({ comment }) => {
  const [liked, setLiked] = useState(comment.likedByUser ?? false);
  const [likes, setLikes] = useState(comment.likes ?? 0);

  const handleToggleLike = () => {
    const willLike = !liked;
    setLiked(willLike);
    setLikes((prev) => (willLike ? prev + 1 : Math.max(prev - 1, 0)));
    // TODO: integrate likeComment/unlikeComment API
  };

  return (
    <div className="flex w-full flex-col">
      {/* Header ----------------------------------------------------------- */}
      <div className="relative flex w-full gap-4">
        <Avatar className="border border-mountain-200">
          <AvatarImage src={comment.user.profile_picture_url ?? undefined} />
          <AvatarFallback>
            {comment.user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm text-mountain-600">
            <span className="font-semibold">@{comment.user.username}</span>
            <span>·</span>
            <span>{formatDate(comment.created_at.toISOString())}</span>
          </div>
          <p className="pr-2">{comment.content}</p>
        </div>

        {/* Menu ----------------------------------------------------------- */}
        <Popover>
          <PopoverTrigger className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-mountain-100">
            <BiDotsVertical className="size-5" />
          </PopoverTrigger>
          <PopoverContent className="w-28 rounded-lg border border-mountain-200 p-0 text-xs">
            <div className="flex cursor-pointer items-center border-b border-mountain-200 px-3 py-2 hover:bg-mountain-50">
              <IoPersonRemoveOutline className="mr-2" />
              <p>Block User</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Footer ----------------------------------------------------------- */}
      <div className="ml-10 flex items-center gap-2">
        <button
          onClick={handleToggleLike}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-mountain-100"
          title={liked ? "Unlike" : "Like"}
        >
          <AiOutlineLike className={`size-5 ${liked ? "text-blue-600" : ""}`} />
        </button>
        <span className="text-sm font-medium">{likes}</span>
        <button className="flex h-10 items-center justify-center rounded-full px-3 hover:bg-mountain-100">
          <span className="text-sm font-medium">Reply Comment</span>
        </button>
      </div>

      {/* Replies ---------------------------------------------------------- */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 mt-4 flex flex-col space-y-4">
          {comment.replies.map((r) => (
            <CommentRow key={r.id} comment={toCommentUI(r)} />
          ))}
        </div>
      )}
    </div>
  );
};
