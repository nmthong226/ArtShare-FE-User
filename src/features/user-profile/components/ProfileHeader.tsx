import type { FC } from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatarUrl: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  name,
  avatarUrl,
}) => {
  return (
    <div className="flex justify-between items-start p-4">
      {/* Profile picture */}
      <div className="border-4 border-black rounded-full w-36 h-36 overflow-hidden">
        <img
          src={avatarUrl || "/placeholder.svg"}
          alt={`${name}'s profile picture`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
