import type { FC } from "react";
import ProfileStats from "./ProfileStats";

interface ProfileInfoProps {
  name: string;
  username: string;
  bio: string;
  followings_count: number;
  followers_count: number;
  userId: string;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  name,
  username,
  bio,
  followings_count,
  followers_count,
  userId,
}) => {
  return (
    <div className="pt-3 px-4 pb-3">
      <h1 className="text-black dark:text-white text-xl font-bold">{name}</h1>
      <p className="text-black dark:text-gray-500">@{username}</p>
      <p className="mt-3 text-sm text-black dark:text-white">{bio}</p>
      <ProfileStats
        following={followings_count || 0}
        followers={followers_count || 0}
        userId={userId}
      />
    </div>
  );
};

export default ProfileInfo;
