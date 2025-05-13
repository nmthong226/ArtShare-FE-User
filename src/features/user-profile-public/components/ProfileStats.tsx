import type { FC } from "react";

interface ProfileStatsProps {
  following: number;
  followers: number;
}

const ProfileStats: FC<ProfileStatsProps> = ({ following, followers }) => {
  return (
    <div className="py-3 flex gap-4 text-sm">
      <div className="flex items-center">
        <span className="font-bold text-black dark:text-white">
          {following}
        </span>
        <span className="ml-1 text-black dark:text-gray-500">Following</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-black dark:text-white">
          {followers}
        </span>
        <span className="ml-1 text-black dark:text-gray-500">Followers</span>
      </div>
    </div>
  );
};

export default ProfileStats;
