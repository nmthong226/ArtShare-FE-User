import SettingsLayout from "./settings/layout"
import EditUser from "./EditUser";
import { useSettingView } from "@/contexts/SettingUserProfileProvider";
import Notification from "./Notification";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "./api/user-profile.api";

export default function EditUserPage() {
  const { view } = useSettingView();
  const { data: profileData } = useQuery({
    queryKey: ['userProfile'], // Unique key for this query
    queryFn: getUserProfile,
    // cacheTime: 5 * 60 * 1000,
  });
  
  return (
    <SettingsLayout>
      {(view === "profile" || view === "account") && profileData && <EditUser profileData={profileData} />}
      {view === "notification" && <Notification />} 
    </SettingsLayout>
  )
}
