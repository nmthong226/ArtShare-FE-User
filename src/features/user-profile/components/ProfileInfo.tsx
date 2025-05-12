import type { FC } from "react";

interface ProfileInfoProps {
  name: string;
  username: string;
  bio: string;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  name,
  username,
  bio,
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-black dark:text-white text-xl">{name}</h1>
      <p className="text-black dark:text-gray-500">@{username}</p>
      <p className="text-black dark:text-white text-sm">{bio}</p>
    </div>
  );
};

export default ProfileInfo;
