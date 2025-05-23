import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  MouseEvent,
} from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextareaAutosize,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  SendHorizontal,
  Heart,
  MoreVertical,
} from "lucide-react";
import Avatar from "boring-avatars";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import api from "@/api/baseApi";
import {
  likeComment,
  createComment,
  fetchComments,
  unlikeComment,
} from "../api/comment.api";
import { CommentUI, CreateCommentDto } from "@/types/comment";
import { useUser } from "@/contexts/UserProvider";
import { User } from "@/types";

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                */
/* ------------------------------------------------------------------ */
const INDENT = 44;

const addReplyRecursive = (
  list: CommentUI[],
  parentId: number,
  reply: CommentUI,
): CommentUI[] =>
  list.map((c) => {
    if (c.id === parentId) {
      return {
        ...c,
        replies: c.replies ? [...c.replies, reply] : [reply],
        reply_count: (c.reply_count ?? 0) + 1, // ← bump the count
      };
    }
    return c.replies?.length
      ? { ...c, replies: addReplyRecursive(c.replies, parentId, reply) }
      : c;
  });

const toggleLikeRecursive = (list: CommentUI[], id: number): CommentUI[] =>
  list.map((c) =>
    c.id === id
      ? {
          ...c,
          likedByCurrentUser: !c.likedByCurrentUser,
          like_count: (c.like_count ?? 0) + (c.likedByCurrentUser ? -1 : 1),
        }
      : c.replies?.length
        ? { ...c, replies: toggleLikeRecursive(c.replies, id) }
        : c,
  );

const removeRecursive = (list: CommentUI[], id: number): CommentUI[] =>
  list
    .filter((c) => c.id !== id)
    .map((c) =>
      c.replies?.length ? { ...c, replies: removeRecursive(c.replies, id) } : c,
    );

const updateContentRecursive = (
  list: CommentUI[],
  id: number,
  content: string,
): CommentUI[] =>
  list.map((c) =>
    c.id === id
      ? { ...c, content, updated_at: new Date() }
      : c.replies?.length
        ? { ...c, replies: updateContentRecursive(c.replies, id, content) }
        : c,
  );

/* ------------------------------------------------------------------ */
/* Single comment row                                                 */
/* ------------------------------------------------------------------ */
interface RowProps {
  postId: number;
  depth?: number;
  comment: CommentUI;
  onLike: (id: number) => void;
  onReply: (id: number, username: string) => void;
  onDelete: (id: number) => void;
  onRepliesFetched: (id: number, replies: CommentUI[]) => void;
  /* edit handlers */
  editingId: number | null;
  onStartEdit: (id: number) => void;
  onAbortEdit: () => void;
  onCommitEdit: (id: number, value: string) => Promise<void>;
}

const CommentRow = ({
  postId,
  depth = 0,
  comment,
  onLike,
  onReply,
  onDelete,
  onRepliesFetched,
  editingId,
  onStartEdit,
  onAbortEdit,
  onCommitEdit,
}: RowProps) => {
  const { user } = useUser();
  const CURRENT_USER_ID = user?.id;
  const isMine = comment.user_id === CURRENT_USER_ID;
  const isEditing = editingId === comment.id;
  const editRef = useRef<HTMLTextAreaElement>(null);
  const prevReplyCountRef = useRef(comment.replies?.length || 0); //// keep track of how many replies we *had* last render
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenu = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // Date formatting options
  const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const DATETIME_FORMAT_OPTIONS_FOR_TITLE: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  useEffect(() => {
    const prev = prevReplyCountRef.current;
    const curr = comment.replies?.length ?? 0;
    // if we went from 0 → >0, open the thread
    if (prev === 0 && curr > 0 && !showReplies) {
      // Only if not already shown
      setShowReplies(true);
    }
    prevReplyCountRef.current = curr;
  }, [comment.replies, showReplies]);

  const toggleReplies = async () => {
    const needsToFetch =
      !showReplies &&
      (comment.replies === undefined ||
        (comment.replies.length === 0 && (comment.reply_count ?? 0) > 0));

    if (needsToFetch) {
      try {
        setLoading(true);
        const fetchedReplies = await fetchComments(postId, comment.id);
        onRepliesFetched(comment.id, fetchedReplies as CommentUI[]);
        // setShowReplies(true) will be handled by the toggle at the end
      } catch (err) {
        console.error(
          "Failed to load replies for comment " + comment.id + ":",
          err,
        );
        // Consider your Snackbar here:
        // Snackbar({ open: true, message: "Failed to load replies.", autoHideDuration: 3000 });
      } finally {
        setLoading(false);
      }
    }
    setShowReplies((s) => !s); // Toggle visibility
  };

  // Helper to get button text
  const getReplyButtonTextContent = () => {
    const count = comment.reply_count ?? 0; // Always base on reply_count from server
    return `${count} ${count === 1 ? "reply" : "replies"}`;
  };

  return (
    <div id={`comment-${comment.id}`} className="w-full">
      {/* Row */}
      <div className="flex gap-3 py-3 w-full">
        {comment.user.profile_picture_url ? (
          <img
            src={comment.user.profile_picture_url}
            alt={comment.user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <Avatar
            name={comment.user.username}
            size={32}
            variant="beam"
            colors={["#84bfc3", "#ff9b62", "#d96153"]}
          />
        )}
        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">@{comment.user.username}</span>
            <span
              className="text-neutral-500 text-xs"
              title={
                new Date(comment.updated_at).getTime() !==
                new Date(comment.created_at).getTime()
                  ? `Edited ${new Date(comment.updated_at).toLocaleString(
                      undefined,
                      DATETIME_FORMAT_OPTIONS_FOR_TITLE,
                    )}`
                  : undefined
              }
            >
              {new Date(comment.created_at).toLocaleDateString(
                undefined,
                DATE_FORMAT_OPTIONS,
              )}
              {new Date(comment.updated_at).getTime() !==
                new Date(comment.created_at).getTime() && " (edited)"}
            </span>
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <TextareaAutosize
                ref={editRef}
                defaultValue={comment.content}
                minRows={2}
                className="w-full border border-neutral-300 rounded-md p-2"
              />
              <div className="flex gap-2 text-xs">
                <Button
                  size="small"
                  onClick={async () =>
                    await onCommitEdit(
                      comment.id,
                      editRef.current!.value.trim(),
                    )
                  }
                >
                  Save
                </Button>
                <Button size="small" variant="outlined" onClick={onAbortEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
          )}

          <div className="flex items-center gap-4 mt-1 text-xs text-neutral-600">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 hover:text-black ${
                comment.likedByCurrentUser ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <Heart size={16} />
              <span>{comment.like_count ?? 0}</span>
            </button>
            <button
              onClick={() => onReply(comment.id, comment.user.username)}
              className="hover:text-black"
            >
              Reply
            </button>
          </div>
        </div>

        {isMine && !isEditing && (
          <>
            <IconButton onClick={handleMenu} className="!p-1">
              <MoreVertical size={20} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={closeMenu}>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  onStartEdit(comment.id);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  onDelete(comment.id);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* Replies */}
      {((comment.reply_count ?? 0) > 0 ||
        (comment.replies?.length ?? 0) > 0) && (
        <div className="flex flex-col gap-1" style={{ marginLeft: INDENT }}>
          <button
            onClick={toggleReplies}
            disabled={loading && !showReplies}
            className="flex items-center gap-1 text-xs text-blue-600 disabled:text-neutral-400"
          >
            {loading && !showReplies ? ( // Spinner when fetching to expand
              <CircularProgress
                size={14}
                color="inherit"
                sx={{ marginRight: "4px" }}
              />
            ) : showReplies ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
            {showReplies ? "Hide" : "View"} {getReplyButtonTextContent()}{" "}
            {/* Use helper for consistent count */}
          </button>

          {/* Optional: More prominent loading indicator when fetching to show */}
          {loading && !showReplies && (
            <div className="flex items-center gap-1 text-xs text-neutral-500 p-2">
              <CircularProgress size={12} /> Loading replies…
            </div>
          )}
          {/* Render actual replies IF they are meant to be shown AND data exists */}
          {showReplies &&
            comment.replies && // Check if replies array exists
            comment.replies.length > 0 && // Check if it has content
            comment.replies.map((r: CommentUI) => (
              <CommentRow
                postId={postId}
                key={r.id}
                depth={depth + 1}
                comment={r}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
                onRepliesFetched={onRepliesFetched}
                editingId={editingId}
                onStartEdit={onStartEdit}
                onAbortEdit={onAbortEdit}
                onCommitEdit={onCommitEdit}
              />
            ))}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
interface Props {
  comments: CommentUI[];
  postId: number;
  onCommentAdded(): void;
  onCommentDeleted(): void;
}

const PostComments = forwardRef<HTMLDivElement, Props>(
  ({ comments: initial, postId, onCommentAdded, onCommentDeleted }, _ref) => {
    const { user } = useUser();
    const CURRENT_USER_ID = user?.id;
    const { postCommentsRef } = useFocusContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const listRef = useRef<HTMLDivElement>(null); // scroll target
    const [comments, setComments] = useState<CommentUI[]>(initial);
    const [newComment, setNewComment] = useState("");
    const [replyParentId, setReplyParentId] = useState<number | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
      setComments(initial);
    }, [initial]);

    useImperativeHandle(postCommentsRef, () => ({
      focusInput: () => textareaRef.current?.focus(),
    }));

    const attachReplies = (id: number, replies: CommentUI[]) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, replies }
            : c.replies?.length
              ? { ...c, replies: attachRepliesTo(c.replies, id, replies) }
              : c,
        ),
      );
    };
    const attachRepliesTo = (
      list: CommentUI[],
      id: number,
      replies: CommentUI[],
    ): CommentUI[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, replies }
          : c.replies?.length
            ? { ...c, replies: attachRepliesTo(c.replies, id, replies) }
            : c,
      );

    /* -------------------- CREATE ---------------------------------- */
    const handleAdd = async () => {
      const content = newComment.trim();
      if (!content) return;

      const tmpId = Date.now();
      const now = new Date();
      const parentId = replyParentId;

      // Create optimistic comment
      const optimistic: CommentUI = {
        id: tmpId,
        user_id: CURRENT_USER_ID || "",
        user: {
          id: CURRENT_USER_ID!,
          username: user?.username || "",
          profile_picture_url: user?.profile_picture_url,
        } as User,
        parent_comment_id: replyParentId,
        target_id: postId,
        target_type: "POST",
        content,
        created_at: now,
        updated_at: now,
        replies: [],
        like_count: 0,
        likedByCurrentUser: false,
        reply_count: 0,
      };

      // Optimistically update UI to show the new reply (and bump reply_count)
      setComments((prev) =>
        parentId
          ? addReplyRecursive(prev, parentId, optimistic)
          : [optimistic, ...prev],
      );

      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      // Clear input and set states
      setNewComment("");
      onCommentAdded();
      setReplyParentId(null);
      setIsPosting(true);

      try {
        const payload: CreateCommentDto = {
          content,
          target_id: postId,
          target_type: "POST",
          parent_comment_id: parentId ?? undefined,
        };

        const { data } = await createComment(payload);

        // Replace the optimistic comment while preserving hierarchy
        if (parentId) {
          // For replies, update within the nested structure
          setComments((prev) =>
            prev.map((comment) => {
              if (comment.id === replyParentId) {
                // Replace the temp reply with the real one in this parent
                return {
                  ...comment,
                  replies:
                    comment.replies?.map((reply) =>
                      reply.id === tmpId ? data : reply,
                    ) || [],
                };
              } else if (comment.replies?.length) {
                // Search deeper in the tree
                return {
                  ...comment,
                  replies: updateReplyInNestedStructure(
                    comment.replies,
                    replyParentId,
                    tmpId,
                    data,
                  ),
                };
              }
              return comment;
            }),
          );
        } else {
          // For top-level comments, replace the temp one with the real one
          setComments((prev) => prev.map((c) => (c.id === tmpId ? data : c)));
        }

        // Scroll the list to see the new comment
        setTimeout(() => {
          if (replyParentId) {
            // Find the parent comment element and scroll to it
            const parentEl = document.getElementById(
              `comment-${replyParentId}`,
            );
            if (parentEl) {
              parentEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          } else {
            // For top-level comments, scroll to top
            listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
        setReplyParentId(null);
      } catch (err) {
        console.error(err);
        setComments((prev) => removeRecursive(prev, tmpId));
        alert("Failed to post comment.");
      } finally {
        setIsPosting(false);
      }
    };

    // Helper function to update a reply in a nested comment structure
    const updateReplyInNestedStructure = (
      replies: CommentUI[],
      parentId: number,
      tmpId: number,
      newData: CommentUI,
    ): CommentUI[] => {
      return replies.map((reply) => {
        if (reply.id === parentId) {
          // This is the parent, replace the temp reply
          return {
            ...reply,
            replies:
              reply.replies?.map((r) => (r.id === tmpId ? newData : r)) || [],
          };
        } else if (reply.replies?.length) {
          // Continue searching
          return {
            ...reply,
            replies: updateReplyInNestedStructure(
              reply.replies,
              parentId,
              tmpId,
              newData,
            ),
          };
        }
        return reply;
      });
    };
    /* -------------------- DELETE ---------------------------------- */
    const handleDelete = async (id: number) => {
      const prev = comments;
      setComments(removeRecursive(prev, id));
      setDeletingId(id);
      try {
        await api.delete(`/comments/${id}`);
        onCommentDeleted();
      } catch (err) {
        console.error(err);
        setComments(prev);
        alert("Could not delete comment.");
      } finally {
        setDeletingId(null);
      }
    };

    /* -------------------- EDIT ------------------------------------ */
    const startEdit = (id: number) => setEditingId(id);
    const abortEdit = () => setEditingId(null);

    const commitEdit = async (id: number, value: string) => {
      if (!value) return;
      const prev = comments;
      setComments(updateContentRecursive(prev, id, value));
      setEditingId(null);
      try {
        await api.patch(`/comments/${id}`, { content: value });
      } catch (err) {
        console.error(err);
        setComments(prev);
        alert("Could not update comment.");
      }
    };

    /* -------------------- LIKE ------------------------------------ */
    const handleLike = async (id: number) => {
      // Find the comment to check if it's already liked
      const comment = comments
        .flatMap(function findAll(c): CommentUI[] {
          return [c, ...(c.replies ? c.replies.flatMap(findAll) : [])];
        })
        .find((c) => c.id === id);

      const alreadyLiked = comment?.likedByCurrentUser;
      console.log(alreadyLiked);

      setComments((prev) => toggleLikeRecursive(prev, id));
      try {
        if (alreadyLiked) {
          await unlikeComment(id);
        } else {
          await likeComment(id);
        }
      } catch (_err) {
        console.error(_err);
        Snackbar({
          open: true,
          message: "Failed to load replies.",
          autoHideDuration: 3000,
        });
      }
    };

    /* -------------------- FETCH ----------------------------------- */
    useEffect(() => {
      const loadComments = async () => {
        try {
          const data = await fetchComments(postId); // already nested
          setComments(data as CommentUI[]);
        } catch (err) {
          console.error("Failed to load comments:", err);
        }
      };
      if (postId) {
        // Ensure postId is available
        loadComments();
      }
    }, [postId]);

    return (
      <div
        ref={_ref}
        className="flex flex-col gap-4 bg-white rounded-2xl w-full pb-28"
      >
        <h4 className="font-bold text-sm">Comments</h4>

        <div
          ref={listRef}
          className="flex flex-col divide-y divide-neutral-100 overflow-y-auto"
        >
          {comments.length === 0 ? (
            <p className="text-sm text-center text-mountain-500 py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((c) => (
              <CommentRow
                postId={postId}
                key={c.id}
                comment={c}
                onLike={handleLike}
                onReply={(id, username) => {
                  setReplyParentId(id);
                  setNewComment(`@${username} `);
                  textareaRef.current?.focus();
                }}
                onDelete={handleDelete}
                onRepliesFetched={attachReplies}
                editingId={editingId}
                onStartEdit={startEdit}
                onAbortEdit={abortEdit}
                onCommitEdit={commitEdit}
              />
            ))
          )}
        </div>

        {/* input */}
        <div className="right-0 bottom-0 left-0 absolute flex gap-2 bg-white p-4 border-t-[1px] border-mountain-200 rounded-2xl rounded-t-none">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Avatar
              name={user?.username || ""}
              size={32}
              variant="beam"
              colors={["#84bfc3", "#ff9b62", "#d96153"]}
            />
          )}
          <div className="flex flex-grow gap-2">
            <TextareaAutosize
              ref={textareaRef}
              placeholder={replyParentId ? `Replying to...` : "Add a comment"}
              className="border border-neutral-300 rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 "
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
              onKeyDown={(e) => {
                // submit on Enter, new line on Shift+Enter
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (newComment.trim()) handleAdd();
                }
              }}
            />

            <Button
              variant="contained"
              className="p-0.5 min-w-auto h-12 aspect-[1/1]"
              onClick={handleAdd}
              disabled={!newComment.trim() || isPosting}
            >
              {isPosting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendHorizontal />
              )}
            </Button>
          </div>
        </div>

        {deletingId && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
            <CircularProgress size={20} />{" "}
            <span className="ml-2">Deleting…</span>
          </div>
        )}
      </div>
    );
  },
);

PostComments.displayName = "PostComments";
export default PostComments;
