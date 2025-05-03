import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "./api/user-profile.api";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import ProfileStats from "./components/ProfileStats";

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
    <div>
      <ProfileHeader
        name={profileData.username || "Fullname"}
        username={profileData.username || ""}
        avatarUrl={
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PeikEtNBDB6QS6667WSA8RN6kMQUfR.png"
        }
        isFollowing={false}
      />
      <ProfileInfo
        name={profileData.username || "Phan Trương Quý Hòa"}
        username={profileData.username}
        bio={profileData.bio || ""}
        location={"Vietnam"}
        website={"https://www.pixilart.com/marfish"}
      />
      <ProfileStats
        following={profileData.following_count}
        followers={profileData.followers_count}
      />
    </div>
  );
};
