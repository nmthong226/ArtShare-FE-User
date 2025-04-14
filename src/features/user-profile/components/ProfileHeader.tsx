import type { FC } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Mail } from "lucide-react"
import { useTheme } from "@/contexts/ThemeProvider"

interface ProfileHeaderProps {
  name: string
  username: string
  avatarUrl: string
  isFollowing: boolean
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ name, avatarUrl, isFollowing }) => {
  const { theme } = useTheme();
  const iconColor = theme === "light" ? "black" : "white";
  return (
    <div className="p-4 flex items-start justify-between">
      <div className="flex items-center gap-3">
        {/* Profile picture */}
        <div className="w-30 h-30 rounded-full overflow-hidden border-4 border-black">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt={`${name}'s profile picture`}
            className="w-full h-full object-cover"
          />
      </div>
      </div>
      <div className="flex items-center gap-2">
      <Button
      variant="ghost"
      size="lg"
      className="rounded-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          >
      <Mail className="h-4 w-4" color={iconColor} />
      <span className="sr-only">Message</span>
    </Button>
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="lg"
          className={`rounded-full ${isFollowing ? "bg-transparent border border-gray-600 hover:bg-gray-800 text-white" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"}`}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent border border-gray-600 hover:bg-gray-800"
        >
          <MoreHorizontal className="h-4 w-4" color={iconColor} />
          <span className="sr-only">More options</span>
        </Button>
      </div>
    </div>
  )
}

export default ProfileHeader
