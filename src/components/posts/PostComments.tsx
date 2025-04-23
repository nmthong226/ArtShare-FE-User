import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { Button, IconButton, TextareaAutosize } from "@mui/material";
import { Ellipsis, Dot, SendHorizontal } from "lucide-react";
import Avatar from "boring-avatars";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import { AiFillLike } from "react-icons/ai";
import { BsClockFill } from "react-icons/bs";

const PostComments = forwardRef(() => {
  const { postCommentsRef } = useFocusContext();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // State to store the list of comments and the new comment input
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Michael Guimont",
      handle: "@michael_guimont",
      avatarColor: ["#84bfc3", "#fff5d6", "#ffb870", "#d96153", "#000511"],
      content: "very cute!!",
      likes: 53,
      likedByUser: false, // Track if the current user has liked this comment
      timestamp: "2d",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  // Handle focusing on the input
  useImperativeHandle(postCommentsRef, () => ({
    focusInput: () => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    },
  }));

  // Handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          username: "New User", // This can be dynamic based on the logged-in user
          handle: "@new_user", // Example handle
          avatarColor: ["#ffb870", "#d96153", "#000511", "#84bfc3", "#fff5d6"], // Example avatar color
          content: newComment,
          likes: 0,
          likedByUser: false, // Initially, the comment is not liked
          timestamp: "Just now",
        },
      ]);
      setNewComment(""); // Reset the input after adding the comment
    }
  };

  // Handle liking a comment
  const handleLikeComment = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likedByUser: !comment.likedByUser,
              likes: comment.likedByUser
                ? comment.likes - 1
                : comment.likes + 1, // Increment or decrement the like count
            }
          : comment,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="font-bold text-sm">COMMENTS</div>
      <div className="flex flex-col bg-white shadow rounded-2xl">
        <div className="flex flex-col gap-6 p-4 border-b max-h-[448px] md:max-h-[256px] lg:max-h-[384px] xl:max-h-[448px] overflow-y-scroll">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div>
                <Avatar
                  name={comment.username}
                  colors={comment.avatarColor}
                  variant="beam"
                  size={32}
                />
              </div>
              <div className="flex flex-col flex-grow gap-1">
                <div className="font-bold">{comment.username}</div>
                <div className="text-sm">{comment.handle}</div>
                <div className="text-sm">{comment.content}</div>
                <div className="flex items-center text-xs">
                  <div
                    className="hover:bg-gradient-to-r hover:from-blue-800 hover:to-purple-800 px-1.5 py-0.5 border rounded-sm hover:text-white hover:cursor-pointer"
                    onClick={() => handleLikeComment(comment.id)} // Like/Unlike the comment
                  >
                    {comment.likedByUser ? "Unlike" : "Like"}
                  </div>
                  <Dot size={24} className="mx-0.5 text-mountain-400" />
                  <div className="flex items-center gap-1">
                    <AiFillLike
                      size={14}
                      className="-mt-0.5 text-mountain-500"
                    />
                    <span>{comment.likes}</span>
                  </div>
                  <Dot size={24} className="mx-0.5 text-mountain-400" />
                  <div className="flex items-center gap-1">
                    <BsClockFill className="-mt-0.5 text-mountain-500" />
                    <div>{comment.timestamp}</div>
                  </div>
                </div>
              </div>
              <div>
                <IconButton className="-m-2">
                  <Ellipsis size={16} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 p-4">
          <TextareaAutosize
            ref={commentInputRef}
            placeholder="Add a comment"
            className="px-4 py-2 border-2 border-mountain-700 rounded-md w-full"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)} // Update new comment state
          />
          <Button
            variant="contained"
            className="p-0.5 min-w-auto h-12 aspect-[1/1]"
            onClick={handleAddComment}
            disabled={!newComment.trim()} // Disable button if input is empty
          >
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default PostComments;
