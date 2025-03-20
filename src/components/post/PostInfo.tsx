import { Button, Card, CardContent, CardHeader, Divider, IconButton, TextareaAutosize } from "@mui/material";
import { X, HeartIcon, Eye, MessageSquareText, Bookmark, Share2, EllipsisVertical, Ellipsis, Dot, Clock, SendHorizontal } from "lucide-react";
import Avatar from "boring-avatars";
import ShowMoreText from "react-show-more-text";
import { ElementType } from "react";

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;

const PostInfo: React.FC = () => {
  return (
    <div className="text-mountain-900 flex flex-col gap-6 pb-12 px-6 overflow-y-scroll h-screen">
      <div className="p-4 rounded-2xl shadow overflow-none bg-white">
        <CardHeader
          className="p-0"
          action={
            <IconButton>
              <X />
            </IconButton>
          }
        />
        <CardContent className="flex flex-col gap-4 p-0 ">
          <div className="flex gap-4 cursor-pointer">
            <Avatar name="Georgia O" colors={["#84bfc3", "#fff5d6", "#ffb870", "#d96153", "#000511"]} variant="beam" size={80} />
            <div className="flex flex-col pt-0.5">
              <div className="text-2xl font-bold">Michael Guimont</div>
              <div className="text-sm">@michael_guimont</div>
            </div>
          </div>

          <Divider className="border" />

          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl ">Caro & Max's train robbers family</div>
            <AnyShowMoreText
              /* Default options */
              lines={3}
              more="Show more"
              less="Show less"
              className="text-sm"
              anchorClass="cursor-pointer hover:text-cyan-500 block py-2 underline text-sm"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              Here is a poster illustration I did for a couple, friends of mine! They're celebrating their 20 years of being in a relationship
              together and asked me if I could make them something special for the occasion. Since the husband is working as a train conductor, I
              thought it would be appropriate to have their family as train robbers :p Hope you like
            </AnyShowMoreText>
            <div className="italic text-xs">Posted 2 days ago</div>
          </div>

          <Divider className="border" />

          <div className="flex gap-8">
            <div className="flex gap-1">
              <HeartIcon />
              <span>53</span>
            </div>
            <div className="flex gap-1">
              <Eye />
              <span>354</span>
            </div>
            <div className="flex gap-1">
              <MessageSquareText />
              <span>2</span>
            </div>
          </div>

          <Divider className="border" />

          <div className="flex justify-between">
            <IconButton>
              <HeartIcon />
            </IconButton>
            <IconButton>
              <Bookmark />
            </IconButton>
            <IconButton>
              <Share2 />
            </IconButton>
            <IconButton>
              <EllipsisVertical />
            </IconButton>
          </div>
        </CardContent>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold">2 COMMENTS</div>
        <div className="p-4 rounded-2xl shadow flex flex-col gap-6 bg-white">
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

          <div className="flex gap-2">
            <TextareaAutosize placeholder="Add a comment" className="border-2 border-mountain-700 rounded-md py-2 px-4 w-full h-auto" />
            <Button variant="contained" className="min-w-auto aspect-[1/1] p-0.5 h-12">
              <SendHorizontal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInfo;
