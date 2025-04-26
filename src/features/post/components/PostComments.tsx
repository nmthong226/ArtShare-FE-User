import { useRef, forwardRef, useImperativeHandle } from "react";
import { Button, IconButton, TextareaAutosize } from "@mui/material";
import { Ellipsis, Dot, SendHorizontal } from "lucide-react";
import Avatar from "boring-avatars";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import { AiFillLike } from "react-icons/ai";
import { BsClockFill } from "react-icons/bs";

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
    <div className="flex flex-col gap-4 pb-24">
      <div className="font-bold text-sm">COMMENTS</div>
      <div className="flex flex-col bg-white">
        <div className="flex flex-col gap-6">
          {count.map(() => (
            <div className="flex gap-2">
              <div>
                <Avatar
                  name="Georgia O"
                  colors={[
                    "#84bfc3",
                    "#fff5d6",
                    "#ffb870",
                    "#d96153",
                    "#000511",
                  ]}
                  variant="beam"
                  size={32}
                />
              </div>
              <div className="flex flex-col flex-grow gap-1">
                <div className="">
                  <div className="font-bold">Michael Guimont</div>
                  <div className="text-sm">@michael_guimont</div>
                </div>
                <div className="text-sm">very cute!!</div>
                <div className="flex items-center text-xs">
                  <div className="hover:bg-gradient-to-r hover:from-blue-800 hover:to-purple-800 px-1.5 py-0.5 border rounded-sm hover:text-white hover:cursor-pointer">
                    Like
                  </div>
                  <Dot size={24} className="mx-0.5 text-mountain-400" />
                  <div className="flex items-center gap-1">
                    <AiFillLike
                      size={14}
                      className="-mt-0.5 text-mountain-500"
                    />
                    <span>53</span>
                  </div>
                  <Dot size={24} className="mx-0.5 text-mountain-400" />
                  <div className="flex items-center gap-1">
                    <BsClockFill className="-mt-0.5 text-mountain-500" />
                    <div>2d</div>
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

        <div className="flex gap-2 p-4 absolute bottom-0 left-0 right-0 bg-white rounded-2xl">
          <TextareaAutosize
            ref={commentInputRef}
            placeholder="Add a comment"
            className="px-4 py-2 border-2 border-mountain-700 rounded-md w-full"
          />
          <Button
            variant="contained"
            className="p-0.5 min-w-auto h-12 aspect-[1/1]"
          >
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default PostComments;
