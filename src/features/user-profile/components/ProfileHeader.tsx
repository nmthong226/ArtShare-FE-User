import type { FC } from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatarUrl: string;
  isFollowing: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  name,
  avatarUrl,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {/* Profile picture */}
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-black">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt={`${name}'s profile picture`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;