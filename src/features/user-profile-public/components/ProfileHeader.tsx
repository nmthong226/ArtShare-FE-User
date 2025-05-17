import type { FC } from "react";
import Avatar from "boring-avatars";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatarUrl?: string; // make it optional
  isFollowing: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  name,
  username,
  avatarUrl,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-black">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s profile picture`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar
              name={username || "Unknown"}
              colors={["#84bfc3", "#fff5d6", "#ffb870", "#d96153", "#000511"]}
              variant="beam"
              size={160} // matches w-40 (160px)
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
