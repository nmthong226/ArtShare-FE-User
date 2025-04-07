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
              className="text-sm"
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

          <div className="flex gap-8 text-mountain-950">
            <div className="flex items-center gap-1 text-sm">
              <span>{likeCount > 1 ? likeCount + " Likes" : likeCount + " Like"}</span>
            </div>
            <div className="flex gap-1 text-sm">
              {/* <Eye /> */}
              <span>354 Views</span>
            </div>
            <div className="flex gap-1 text-sm">
              {/* <MessageSquareText /> */}
              <span>{postData.comment_count} Comments</span>
            </div>
          </div>

          <Divider className="border-0.5" />

          <div className="flex justify-between -my-1.5">
            <Button className="flex gap-1 -mx-2 px-2 py-2 w-20 text-blue-900" title="Like" onClick={handleLikeClick}>
              {userLike ?
                <>
                  <AiFillLike className="size-6" />
                  <span className="font-normal text-sm normal-case">Liked</span>
                </> : <>
                  <AiOutlineLike className="size-6" />
                  <span className="font-normal text-sm normal-case">Like</span>
                </>}
            </Button>
            <Button className="flex gap-1 -mx-2 px-2 py-2 text-blue-900" title="Save" onClick={handleClickOpen}>
              <Bookmark />
              <span className="font-normal text-sm normal-case">Save</span>
            </Button>
            <Button className="flex gap-1 -mx-2 px-2 py-2 text-blue-900" title="Comment" onClick={handleFocusCommentInput}>
              <MessageSquareText />
              <span className="font-normal text-sm normal-case">Comment</span>
            </Button>
            <Button className="min-w-auto aspect-[1/1] text-blue-900">
              <EllipsisVertical />
            </Button>
          </div>
        </CardContent>
        <SavePostDialog postId={postData.id} open={open} onClose={handleClose} />
      </div>
    )
  );
};

export default PostInfo;