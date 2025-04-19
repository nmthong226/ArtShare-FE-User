import type { FC } from "react"
import { Link } from "lucide-react"

interface ProfileInfoProps {
  name: string
  username: string
  bio: string
  location: string
  website: string
}

const ProfileInfo: FC<ProfileInfoProps> = ({ name, username, bio, location, website }) => {
  return (
    <div className="px-4 pt-8 pb-3">
      <h1 className="text-black dark:text-white text-xl font-bold">{name}</h1>
      <p className="text-black dark:text-gray-500">@{username}</p>

      <p className="mt-3 text-sm text-black dark:text-white">{bio}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black dark:text-gray-500">
        {location && (
          <div className="flex items-center">
            <span>{location}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center">
            <Link className="h-3.5 w-3.5 mr-1" />
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileInfo
