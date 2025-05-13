import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "./api/user-profile.api";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import ProfileStats from "./components/ProfileStats";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

export const UserProfileCard = () => {
  // const profileData = {
  //     name: "MarFish",
  //     username: "marfish",
  //     bio: "Hey, i'm MarFish! Just a little guy who likes to create silly characters. I'm seeking to make friends mostly and share my stuff. Also, be nice c:",
  //     location: "Brazil",
  //     website: "https://www.pixilart.com/marfish",
  //     following: 40,
  //     followers: 134,
  //     avatarUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PeikEtNBDB6QS6667WSA8RN6kMQUfR.png",
  //     isFollowing: false,
  //   }

  const { theme } = useTheme();
  const iconColor = theme === "light" ? "black" : "white";

  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile"], // Unique key for this query
    queryFn: getUserProfile,
    // cacheTime: 5 * 60 * 1000,
  });

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
    <div className="flex justify-between items-center h-full">
      <div className="flex items-center space-x-4 h-full">
        <ProfileHeader
          name={profileData.username || "Fullname"}
          username={profileData.username || ""}
          avatarUrl={
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PeikEtNBDB6QS6667WSA8RN6kMQUfR.png"
          }
        />
        <div className="flex flex-col">
          <ProfileInfo
            name={profileData.username || "Phan Trương Quý Hòa"}
            username={profileData.username}
            bio={profileData.bio || ""}
          />
          <ProfileStats
            following={profileData.following_count}
            followers={profileData.followers_count}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="lg"
          className="bg-blue-500 hover:bg-blue-700 rounded-full text-black dark:text-white cursor-pointer"
        >
          <Mail className="w-4 h-4" color={iconColor} />
          <span className="sr-only">Message</span>
        </Button>
        <Button
          size="lg"
          className={`rounded-full  bg-blue-500 hover:bg-blue-600 cursor-pointer`}
        >
          Follow
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="bg-blue-500 hover:bg-blue-700 rounded-full text-white cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" color={iconColor} />
          <span className="sr-only">More options</span>
        </Button>
      </div>
    </div>
  );
};