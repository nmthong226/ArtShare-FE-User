/* PostComments.tsx ------------------------------------------------------ */
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
} from "@mui/material";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Avatar from "boring-avatars";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import api from "@/api/baseApi";
import { likeComment, createComment, fetchComments } from "../api/comment.api";
import { Comment, CommentUI, CreateCommentDto } from "@/types/comment";
import { useUser } from "@/contexts/UserProvider";

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                */
/* ------------------------------------------------------------------ */
const INDENT = 40;

const addReplyRecursive = (
  list: CommentUI[],
  parentId: number,
  reply: CommentUI,
): CommentUI[] =>
  list.map((c) =>
    c.id === parentId
      ? { ...c, replies: c.replies ? [...c.replies, reply] : [reply] }
      : c.replies?.length
        ? { ...c, replies: addReplyRecursive(c.replies, parentId, reply) }
        : c,
  );

const toggleLikeRecursive = (list: CommentUI[], id: number): CommentUI[] =>
  list.map((c) =>
    c.id === id
      ? {
          ...c,
          likedByUser: !c.likedByUser,
          likes: (c.likes ?? 0) + (c.likedByUser ? -1 : 1),
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

  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenu = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const toggleReplies = async () => {
    if (!showReplies && comment.replies === undefined) {
      try {
        setLoading(true);
        const replies = await fetchComments(comment.id);
        onRepliesFetched(comment.id, replies as CommentUI[]);
      } catch (err) {
        console.error(err);
        alert("Could not load replies.");
      } finally {
        setLoading(false);
      }
    }
    setShowReplies((s) => !s);
  };

  return (
    <div className="w-full">
      {/* Row */}
      <div
        className="flex gap-3 py-3 w-full"
        style={{ marginLeft: depth * INDENT }}
      >
        <Avatar
          name={comment.user.username}
          size={32}
          variant="beam"
          colors={["#84bfc3", "#ff9b62", "#d96153"]}
        />
        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">@{comment.user.username}</span>
            <span className="text-neutral-500 text-xs">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
            {new Date(comment.updated_at).getTime() !==
              new Date(comment.created_at).getTime() && (
              <>
                <span className="mx-0.5 text-neutral-400">·</span>
                <span
                  className="text-xs italic text-neutral-400"
                  title={`edited ${new Date(comment.updated_at).toLocaleString()}`}
                >
                  edited at{" "}
                  {new Date(comment.updated_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  on {new Date(comment.updated_at).toLocaleDateString()}
                </span>
              </>
            )}
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
              className="flex items-center gap-1 hover:text-black"
            >
              <ThumbsUp size={16} />
              <span>{comment.like_count ?? 0}</span>
            </button>
            <ThumbsDown size={16} className="cursor-pointer hover:text-black" />
            <button
              onClick={() => onReply(comment.id, comment.user.username)}
              className="hover:text-black"
            >
              Reply
            </button>
            {depth === 0 && (
              <Heart size={16} className="text-rose-500" fill="currentColor" />
            )}
          </div>
        </div>

        {isMine && !isEditing && (
          <>
            <IconButton className="!p-1" onClick={handleMenu}>
              <span>•••</span>
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
      {comment.replies !== undefined && comment.replies.length === 0 ? null : (
        <div className="ml-[32px] flex flex-col gap-1">
          <button
            onClick={toggleReplies}
            className="flex items-center gap-1 text-xs text-blue-600"
          >
            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{" "}
            {showReplies ? "Hide" : "View"}{" "}
            {comment.replies ? comment.replies.length : ""} replies
          </button>
          {loading && (
            <div className="flex items-center gap-1 text-xs text-neutral-500 p-2">
              <CircularProgress size={12} /> Loading replies…
            </div>
          )}
          {showReplies &&
            comment.replies?.map((r: any) => (
              <CommentRow
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
}

const PostComments = forwardRef<HTMLDivElement, Props>(
  ({ comments: initial, postId }, _ref) => {
    const { user } = useUser();
    const CURRENT_USER_ID = user?.id;
    const { postCommentsRef } = useFocusContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      const optimistic: CommentUI = {
        id: tmpId,
        user_id: CURRENT_USER_ID || "",
        user: { id: CURRENT_USER_ID, username: CURRENT_USER_ID } as any,
        parent_comment_id: replyParentId,
        target_id: postId,
        target_type: "POST",
        content,
        created_at: now,
        updated_at: now,
        replies: [],
        likes: 0,
        likedByUser: false,
        like_count: 0,
      };

      setComments((prev) =>
        replyParentId
          ? addReplyRecursive(prev, replyParentId, optimistic)
          : [...prev, optimistic],
      );
      setNewComment("");
      setReplyParentId(null);
      setIsPosting(true);
      try {
        const payload: CreateCommentDto = {
          content,
          target_id: postId,
          target_type: "POST",
          parent_comment_id: replyParentId ?? undefined,
        };
        const { data } = await createComment(payload);
        setComments((prev) =>
          prev.map((c) => (c.id === tmpId ? { ...data } : c)),
        );
      } catch (err) {
        console.error(err);
        setComments((prev) => removeRecursive(prev, tmpId));
        alert("Failed to post comment.");
      } finally {
        setIsPosting(false);
      }
    };

    /* -------------------- DELETE ---------------------------------- */
    const handleDelete = async (id: number) => {
      const prev = comments;
      setComments(removeRecursive(prev, id));
      setDeletingId(id);
      try {
        await api.delete(`/comments/${id}`);
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
      setComments((prev) => toggleLikeRecursive(prev, id));
      try {
        await likeComment(id);
      } catch (err) {
        // revert optimistic update
        setComments((prev) => toggleLikeRecursive(prev, id));
        alert("Could not like comment.");
      }
    };

    /* -------------------- FETCH ----------------------------------- */
    useEffect(() => {
      const loadComments = async () => {
        try {
          const data = await fetchComments(postId);
          setComments(data as CommentUI[]);
        } catch (err) {
          // ignore
        }
      };
      loadComments();
    }, [postId]);

    return (
      <div
        ref={_ref}
        className="flex flex-col gap-4 bg-white shadow rounded-2xl p-6 w-full relative"
      >
        <h4 className="font-bold text-sm">COMMENTS</h4>

        <div className="flex flex-col max-h-[480px] overflow-y-auto divide-y divide-neutral-100">
          {comments.map((c) => (
            <CommentRow
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
          ))}
        </div>

        {/* input */}
        <div className="flex gap-3 pt-2 border-t">
          <Avatar
            name={CURRENT_USER_ID}
            size={32}
            variant="beam"
            colors={["#ffb870", "#d96153", "#000511"]}
          />
          <div className="flex flex-col flex-grow gap-2">
            <TextareaAutosize
              ref={textareaRef}
              placeholder="Add a comment"
              className="border border-neutral-300 rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              minRows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
            />
            <div className="flex gap-2 self-end">
              <Button
                variant="text"
                onClick={() => {
                  setNewComment("");
                  setReplyParentId(null);
                }}
                disabled={!newComment.trim() || isPosting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={!newComment.trim() || isPosting}
              >
                {isPosting ? "Posting…" : "Comment"}
              </Button>
            </div>
          </div>
        </div>

        {deletingId && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
            Deleting…
          </div>
        )}
      </div>
    );
  },
);

PostComments.displayName = "PostComments";
export default PostComments;
