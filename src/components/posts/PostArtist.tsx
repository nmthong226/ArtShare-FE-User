import { Button, CardContent, CardHeader, IconButton } from "@mui/material";
import { X } from "lucide-react";
import Avatar from "boring-avatars";
import { User } from "@/types";
import { Link } from "react-router-dom";

// Icons
import { RiUserFollowLine } from "react-icons/ri";

const PostArtist = ({ artist }: { artist: User }) => {
  return (
    artist && (
      <div className="bg-white shadow p-4 md:border-b md:border-b-mountain-200 rounded-2xl md:rounded-b-none overflow-none">
        <CardHeader
          className="p-0"
          action={
            <Link to="/explore">
              <IconButton>
                <X />
              </IconButton>
            </Link>
          }
        />
        <CardContent className="flex flex-row justify-between items-center gap-4 p-0">
          <div className="flex gap-4 cursor-pointer">
            <div className="relative flex-shrink-0 rounded-full overflow-hidden">
              {artist.profile_picture_url ? (
                <img
                  src={artist.profile_picture_url}
                  className="w-20 h-20 object-cover"
                />
              ) : (
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
                  size={48}
                />
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <div className="font-bold text-xl">
                {artist.fullName || "Mock User"}
              </div>
              {/* <div className="text-sm line-clamp-1">@{artist.username}</div> */}
              <div className="text-sm line-clamp-1">@{"nickname"}</div>
            </div>
          </div>
          <Button variant="contained" className="flex justify-center space-x-1 p-0.5 w-28 min-w-auto h-12 aspect-[1/1] font-normal text-mountain-800 text-sm">
            <RiUserFollowLine className="size-4" />
            <p>Follow</p>
          </Button>
        </CardContent>
      </div>
    )
  );
};

export default PostArtist;
