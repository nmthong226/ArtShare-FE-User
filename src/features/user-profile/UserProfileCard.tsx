import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import { Tooltip } from "@mui/material";
import { getUserProfile, UserProfile } from "./api/user-profile.api";
import { useUser } from "@/contexts/UserProvider";
import { useParams } from "react-router-dom";
import { followUser, unfollowUser } from "./api/follow.api";

export const UserProfileCard = () => {
  const { username: userId } = useParams(); 
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: userId !== undefined || userId === undefined,
  });

  console.log('profile: ', profileData);

   /* ─────────────────── follow / unfollow ────────────── */
  const followMutation = useMutation({
    mutationFn: () => followUser(userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }),
  });

  const toggleFollow = () =>
    profileData?.isFollowing ? unfollowMutation.mutate() : followMutation.mutate();

  const followBtnLoading =
    followMutation.isPending || unfollowMutation.isPending;

  const { user } = useUser(); 
  
  const isOwnProfile = user?.id === profileData?.id;
  const isFollowing = profileData?.isFollowing;
  const iconColor = "white";

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (isError) {
    return <div>Error loading profile: {error?.message}</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }
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
            name={profileData.full_name || "Default fullname"}
            username={profileData.username || ""}
            avatarUrl={"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PeikEtNBDB6QS6667WSA8RN6kMQUfR.png"}
            isFollowing={false}
          />
          <ProfileInfo
            name={profileData.full_name ?? "Default name"}
            username={profileData.username}
            bio={profileData.bio || ""}
            location={"Vietnam"}
            followings_count={profileData.followings_count}
            followers_count={profileData.followers_count}
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
          {!isOwnProfile &&
          <Tooltip title={isFollowing ? "Unfollow" : "Follow"} arrow>
            <Button
              onClick={toggleFollow}
              disabled={followBtnLoading}
              variant={isFollowing ? "outline" : "ghost"}
              size="lg"
              className="rounded-full
                border border-gray-600 text-black dark:text-white 
                bg-blue-500 hover:bg-blue-600 cursor-pointer"
                >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            </Tooltip>
            }
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