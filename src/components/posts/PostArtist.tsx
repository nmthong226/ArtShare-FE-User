import { CardContent, CardHeader, IconButton } from "@mui/material";
import { X } from "lucide-react";
import Avatar from "boring-avatars";
import { User } from "@/types";
import { Link } from "react-router-dom";

const PostArtist = ({ artist }: { artist: User }) => {
  console.log(artist.profilePictureUrl);
  return (
    artist && (
      <div className="bg-white shadow p-4 md:border-b rounded-2xl md:rounded-b-none overflow-none">
        <CardHeader
          className="p-0"
          action={
            <Link to="/gallery">
              <IconButton>
                <X />
              </IconButton>
            </Link>
          }
        />
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex gap-4 cursor-pointer">
            <div className="relative flex-shrink-0 border border-mountain-300 rounded-full overflow-hidden">
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
                  size={80}
                />
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <div className="font-bold text-2xl">{artist.fullName || ""}</div>
              <div className="text-sm">@{artist.username}</div>
            </div>
          </div>
        </CardContent>
      </div>
    )
  );
};

export default PostArtist;
