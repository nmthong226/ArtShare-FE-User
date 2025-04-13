import ProfileHeader from "./components/ProfileHeader"
import ProfileInfo from "./components/ProfileInfo"
import ProfileStats from "./components/ProfileStats"

export const UserProfile = () => {
    const profileData = {
        name: "MarFish",
        username: "marfish",
        bio: "Hey, i'm MarFish! Just a little guy who likes to create silly characters. I'm seeking to make friends mostly and share my stuff. Also, be nice c:",
        location: "Brazil",
        website: "https://www.pixilart.com/marfish",
        following: 40,
        followers: 134,
        avatarUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PeikEtNBDB6QS6667WSA8RN6kMQUfR.png", // Using the provided image
        isFollowing: false,
      }
    return (
        <div className="min-h-screen bg-white dark:bg-black  text-white">
          <div className="max-w-2xl mx-auto">
            <ProfileHeader
              name={profileData.name}
              username={profileData.username}
              avatarUrl={profileData.avatarUrl}
              isFollowing={profileData.isFollowing}
            />
            <ProfileInfo
              name={profileData.name}
              username={profileData.username}
              bio={profileData.bio}
              location={profileData.location}
              website={profileData.website}
            />
            <ProfileStats following={profileData.following} followers={profileData.followers} />
          </div>
        </div>
      )
}
