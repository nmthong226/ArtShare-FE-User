import { useRef, forwardRef, useImperativeHandle } from "react";
import { Button, IconButton, TextareaAutosize } from "@mui/material";
import { HeartIcon, Ellipsis, Dot, Clock, SendHorizontal } from "lucide-react";
import Avatar from "boring-avatars";
import { useFocusContext } from "@/contexts/focus/useFocusText";

const PostComments = forwardRef(() => {
  const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const { postCommentsRef } = useFocusContext();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(postCommentsRef, () => ({
    focusInput: () => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    },
  }));

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-bold">2 COMMENTS</div>
      <div className="rounded-2xl shadow flex flex-col bg-white">
        <div className="overflow-y-scroll flex flex-col gap-6 p-4 max-h-[448px] md:max-h-[256px] lg:max-h-[384px] xl:max-h-[448px] border-b">
          {count.map(() => (
            <div className="flex gap-2">
              <div>
                <Avatar name="Georgia O" colors={["#84bfc3", "#fff5d6", "#ffb870", "#d96153", "#000511"]} variant="beam" size={32} />
              </div>
              <div className="flex flex-col gap-1 flex-grow">
                <div className="">
                  <div className="font-bold">Michael Guimont</div>
                  <div className="text-sm">@michael_guimont</div>
                </div>
                <div className="text-sm">very cute!!</div>
                <div className="flex items-center text-xs">
                  <div className="border py-0.5 px-1.5 rounded-sm">Like</div>
                  <Dot size={36} className="-m-1" />
                  <div className="flex gap-1 items-center">
                    <HeartIcon size={14} />
                    <span>53</span>
                  </div>
                  <Dot size={36} />
                  <div className="flex gap-1 items-center">
                    <Clock size={14} />
                    <span>2d</span>
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
          <TextareaAutosize ref={commentInputRef} placeholder="Add a comment" className="border-2 border-mountain-700 rounded-md py-2 px-4 w-full " />
          <Button variant="contained" className="min-w-auto aspect-[1/1] p-0.5 h-12">
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default PostComments;
