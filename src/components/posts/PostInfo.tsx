import { Button, CardContent, Divider } from "@mui/material";
import { HeartIcon, Eye, MessageSquareText, Bookmark, EllipsisVertical } from "lucide-react";
import ShowMoreText from "react-show-more-text";
import { ElementType, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { Post } from "@/types";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import { SavePostDialog } from "./SavePostDialog";

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;

const PostInfo = ({ postData }: { postData: Post }) => {
  const { postCommentsRef } = useFocusContext();
  const [open, setOpen] = useState(false);

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

          <Divider className="border" />

          <div className="flex gap-8">
            <div className="flex gap-1">
              <HeartIcon />
              <span>{postData.like_count}</span>
            </div>
            <div className="flex gap-1">
              <Eye />
              <span>354</span>
            </div>
            <div className="flex gap-1">
              <MessageSquareText />
              <span>{postData.comment_count}</span>
            </div>
          </div>

          <Divider className="border" />

          <div className="flex justify-between -my-1.5">
            <Button className="flex gap-1 -mx-2 px-2 py-2" title="Like">
              <HeartIcon />
              <span className="font-normal text-sm normal-case">Like</span>
            </Button>
            <Button className="flex gap-1 -mx-2 px-2 py-2" title="Save" onClick={handleClickOpen}>
              <Bookmark />
              <span className="font-normal text-sm normal-case">Save</span>
            </Button>
            <Button className="flex gap-1 -mx-2 px-2 py-2" title="Comment" onClick={handleFocusCommentInput}>
              <MessageSquareText />
              <span className="font-normal text-sm normal-case">Comment</span>
            </Button>
            <Button className="min-w-auto aspect-[1/1]">
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