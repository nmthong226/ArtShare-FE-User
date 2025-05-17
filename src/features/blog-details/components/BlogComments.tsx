import * as React from "react";
import { useRef } from "react";

//Components
import { Button, TextareaAutosize } from "@mui/material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

//Icons
import { BiDotsVertical } from "react-icons/bi";
import { SendHorizontal } from "lucide-react";
import { AiOutlineLike } from "react-icons/ai";
import { UserComments } from "../mocks";
import { IoFilter, IoPersonRemoveOutline } from "react-icons/io5";

//Libs
import { formatDate } from "@/lib/utils";

const BlogComments = () => {
  const [order, setOrder] = React.useState<"top" | "recent">("recent");

  const handleChange = (event: SelectChangeEvent) => {
    setOrder(event.target.value as "top" | "recent");
  };

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="flex flex-col justify-center items-center space-y-8 bg-white shadow mt-8 px-4 py-8 w-[60%] h-full">
      <div className="flex flex-col justify-center space-y-2 w-full">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-lg">2 Comments</span>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={order}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Order By" }}
              MenuProps={{
                disableScrollLock: true,
              }}
              className="relative pl-6"
            >
              <MenuItem value={"recent"}>Recent Comments</MenuItem>
              <MenuItem value={"top"}>Top Comments</MenuItem>
            </Select>
            <IoFilter className="top-1/2 left-2 absolute -translate-y-1/2" />
          </FormControl>
        </div>
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-2 p-4 w-full">
            <TextareaAutosize
              ref={commentInputRef}
              placeholder="Add a comment"
              className="px-4 py-2 border-2 border-mountain-200 rounded-md w-full h-12 overflow-y-auto resize-none"
            />
            <Button
              variant="contained"
              className="p-0.5 min-w-auto h-12 aspect-[1/1]"
            >
              <SendHorizontal />
            </Button>
          </div>
        </div>
        {/* User Comments */}
        <div className="flex flex-col space-y-4 my-4">
          {UserComments.map((user, index) => (
            <div key={index} className="flex flex-col w-full">
              <div className="relative flex space-x-4 w-full">
                <Avatar className="border-1 border-mountain-200">
                  <AvatarImage src={user.userInfo.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 text-mountain-600 text-sm">
                    <span className="font-semibold">
                      @{user.userInfo.username} -{" "}
                    </span>
                    <span>{formatDate(user.dateCreated)}</span>
                  </div>
                  <p className="pr-2">{user.comment}</p>
                </div>
                <Popover>
                  <PopoverTrigger className="top-1/2 right-1 absolute flex justify-center items-center hover:bg-mountain-100 rounded-full w-8 h-8 -translate-y-1/2">
                    <BiDotsVertical className="size-5 shrink-0" />
                  </PopoverTrigger>
                  <PopoverContent className="p-0 border-mountain-200 w-28 text-xs">
                    <div className="flex items-center hover:bg-mountain-50 px-3 py-2 border-mountain-200 border-b-1 rounded-t-lg hover:cursor-pointer">
                      <IoPersonRemoveOutline className="mr-2" />
                      <p>Block User</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2 ml-10">
                <div className="flex items-center">
                  <div className="flex justify-center items-center hover:bg-mountain-100 rounded-full w-10 h-10">
                    <AiOutlineLike className="size-5" />
                  </div>
                  <span className="font-medium text-sm">{user.like_count}</span>
                </div>
                <div className="flex justify-center items-center hover:bg-mountain-100 rounded-full w-32 h-10 hover:cursor-pointer">
                  <span className="font-medium text-sm">Reply Comment</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogComments;
