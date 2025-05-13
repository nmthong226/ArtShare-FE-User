import type { FC } from "react"
import ProfileStats from "./ProfileStats";

interface ProfileInfoProps {
  name: string
  username: string
  bio: string
  location: string
  website: string
  followings_count: number
  followers_count: number
}

const ProfileInfo: FC<ProfileInfoProps> = ({ name, username, bio, followings_count, followers_count }) => {
  return (
    <div className="pt-3 px-4 pb-3">
      <h1 className="text-black dark:text-white text-xl font-bold">{name}</h1>
      <p className="text-black dark:text-gray-500">@{username}</p>

      <p className="mt-3 text-sm text-black dark:text-white">{bio}</p>

      {/* <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black dark:text-gray-500">
        {website && (
          <div className="flex items-center">
            <Link className="h-3.5 w-3.5 mr-1" />
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </div>
        )}
      </div> */}
      <ProfileStats following={followings_count || 0} followers={followers_count || 0} />
    </div>
  );
};

export default ProfileInfo;
