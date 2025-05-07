import { CardContent } from "@mui/material";
import Avatar from "boring-avatars";
import { User } from "@/types";

const PostArtist = ({ artist }: { artist: User }) => {
  return (
    artist && (
      <div className="bg-white py-4 border-b border-b-mountain-200 rounded-2xl rounded-b-none overflow-none">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex gap-4 cursor-pointer">
            <div className="flex-shrink-0 rounded-full overflow-hidden">
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
                {artist.full_name || "Mock User"}
              </div>
              {/* <div className="text-sm line-clamp-1">@{artist.username}</div> */}
              <div className="text-sm line-clamp-1">@{"nickname"}</div>
            </div>
          </div>
        </CardContent>
      </div>
    )
  );
};

export default PostArtist;
