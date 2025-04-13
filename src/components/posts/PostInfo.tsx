import { Button, CardContent, Divider } from "@mui/material";
import {
  MessageSquareText,
  Bookmark,
  EllipsisVertical,
  Share2,
} from "lucide-react";
import ShowMoreText from "react-show-more-text";
import { ElementType, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { Post } from "@/types";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import { SavePostDialog } from "./SavePostDialog";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;

const PostInfo = ({ postData }: { postData: Post }) => {
  const { postCommentsRef } = useFocusContext();
  const [open, setOpen] = useState(false);

  const [userLike, setUserLike] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFocusCommentInput = () => {
    if (postCommentsRef.current) {
      postCommentsRef.current.focusInput();
    }
  };

  const [likeCount, setLikeCount] = useState(postData.like_count);

  const handleLikeClick = () => {
    if (userLike) {
      if (likeCount > 0) {
        setLikeCount(likeCount - 1);
      }
    } else {
      setLikeCount(likeCount + 1); // Increase like count if not liked
    }
    setUserLike(!userLike); // Toggle user like state
  };

  return (
    postData && (
      <div className="bg-white shadow p-4 rounded-2xl md:rounded-t-none overflow-none">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">{postData.title}</div>
            <AnyShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              className="text-sm break-words"
              anchorClass="cursor-pointer hover:text-cyan-500 block py-2 underline text-sm"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {postData.description}
            </AnyShowMoreText>
            <div className="text-xs italic">
              Posted <ReactTimeAgo date={postData.created_at} />
            </div>
          </div>
          <Divider className="border-0.5" />
          <div className="flex gap-6 text-mountain-950">
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{likeCount}</p>
              <span className="text-mountain-600">
                {likeCount > 1 ? " Likes" : " Like"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center gap-1 text-sm">
                <p className="font-semibold">{postData.comment_count}</p>
                <span className="text-mountain-600">
                  {postData.comment_count > 1 ? " Comments" : " Comment"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center gap-1 text-sm">
                <p className="font-semibold">{"1k"}</p>
                <span className="text-mountain-600">Views</span>
              </div>
            </div>
          </div>
          <Divider className="border-0.5" />
          <div className="flex justify-between w-full">
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Like"
              onClick={handleLikeClick}
            >
              {userLike ? (
                <>
                  <AiFillLike className="size-6" />
                </>
              ) : (
                <>
                  <AiOutlineLike className="size-6" />
                </>
              )}
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Comment"
              onClick={handleFocusCommentInput}
            >
              <MessageSquareText />
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Save"
              onClick={handleClickOpen}
            >
              <Bookmark />
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Copy Link"
            >
              <Share2 />
            </Button>
            <Button className="border-0 min-w-auto aspect-[1/1] text-blue-900">
              <EllipsisVertical />
            </Button>
          </div>
        </CardContent>
        <SavePostDialog
          postId={postData.id}
          open={open}
          onClose={handleClose}
        />
      </div>
    )
  );
};

export default PostInfo;
