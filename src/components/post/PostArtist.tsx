import { CardContent, CardHeader, IconButton } from "@mui/material";
import { X } from "lucide-react";
import Avatar from "boring-avatars";
import { User } from "@/types";

const PostArtist = ({ artist }: { artist: User }) => {
  return (
    artist && (
      <div className="p-4 rounded-2xl shadow overflow-none bg-white md:rounded-b-none md:border-b">
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
              <div className="text-2xl font-bold">{artist.fullName}</div>
              <div className="text-sm">@{artist.username}</div>
            </div>
          </div>
        </CardContent>
      </div>
    )
  );
};

export default PostArtist;
