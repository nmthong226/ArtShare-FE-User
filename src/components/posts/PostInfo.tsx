import { Button, CardContent, Divider } from "@mui/material";
import { MessageSquareText, Bookmark, EllipsisVertical } from "lucide-react";
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
      setLikeCount(likeCount - 1); // Decrease like count if already liked
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
              className="text-sm"
              anchorClass="cursor-pointer hover:text-cyan-500 block py-2 underline text-sm"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {postData.description}
            </AnyShowMoreText>

            <div className="flex gap-8 text-mountain-950">
              <div className="flex items-center gap-1 text-sm">
                <span>
                  {likeCount > 1 ? likeCount + " Likes" : likeCount + " Like"}
                </span>
              </div>
            </div>

            <div className="text-xs italic">
              Posted <ReactTimeAgo date={postData.created_at} />
            </div>
          </div>

          <Divider className="border-0.5" />

          <div className="flex justify-between -my-1.5">
            <div>
              <Button
                className="min-w-0 p-2 text-blue-900 border-0"
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
                className="min-w-0 p-2 text-blue-900 border-0"
                title="Comment"
                onClick={handleFocusCommentInput}
              >
                <MessageSquareText />
              </Button>
              <Button
                className="min-w-0 p-2 text-blue-900 border-0"
                title="Save"
                onClick={handleClickOpen}
              >
                <Bookmark />
              </Button>
            </div>

            <Button className="min-w-auto aspect-[1/1] text-blue-900 border-0">
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
