import type { FC } from "react"

interface ProfileStatsProps {
  following: number
  followers: number
}

const ProfileStats: FC<ProfileStatsProps> = ({ following, followers }) => {
  return (
    <div className="px-4 py-3 flex gap-4 text-sm">
      <div className="flex items-center">
        <span className="font-bold text-black dark:text-gray-500">{following}</span>
        <span className="text-black dark:text-gray-500 ml-1">Following</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-black dark:text-gray-500">{followers}</span>
        <span className="text-black dark:text-gray-500 ml-1">Followers</span>
      </div>
    </div>
  )
}

export default ProfileStats;