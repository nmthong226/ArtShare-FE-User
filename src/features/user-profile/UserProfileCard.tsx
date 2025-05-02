import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import { Tooltip } from "@mui/material";
import { getUserProfile } from "./api/user-profile.api";

export const UserProfileCard = () => {
  const { data: profileData, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });
  const isFollowing = false;
  const { theme } = useTheme();
  const iconColor = theme === "light" ? "black" : "white";

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (isError) {
    return <div>Error loading profile: {error?.message}</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          <ProfileHeader
            name={profileData.full_name || "Fullname"}
            username={profileData.username || ""}
            avatarUrl={"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PeikEtNBDB6QS6667WSA8RN6kMQUfR.png"}
            isFollowing={false}
          />
          <ProfileInfo
            name={profileData.full_name || "Phan Trương Quý Hòa"}
            username={profileData.username}
            bio={profileData.bio || ""}
            location={"Vietnam"}
            website={"https://www.pixilart.com/marfish"}
          />
        </div>
        <div className="flex gap-2">
          <Tooltip title="Send a message" arrow>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-black dark:text-white"
            >
              <Mail className="h-4 w-4" color={iconColor} />
              <span className="sr-only">Message</span>
            </Button>
          </Tooltip>
          <Tooltip title={isFollowing ? "Unfollow" : "Follow"} arrow>
            <Button
              variant={isFollowing ? "outline" : "ghost"}
              size="lg"
              className={`rounded-full ${
                isFollowing
                  ? "bg-transparent border border-gray-600 hover:bg-gray-800 text-black dark:text-white"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </Tooltip>
          <Tooltip title="More options" arrow>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
            >
              <MoreHorizontal className="h-4 w-4" color={iconColor} />
              <span className="sr-only">More options</span>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};