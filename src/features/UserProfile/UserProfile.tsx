import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";
import UserPosts from "@/features/UserProfile/components/UserPosts";
import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { UserProfileCard } from "../user-profile/UserProfileCard";
import UserBlogs from "./components/UserBlogs";

const UserProfile = () => {
  const { username } = useParams();
  const { user } = useUser();
  const isOwner = user?.username === username;
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box className="sm:px-6 md:px-4 lg:px-6 py-4 bg-mountain-1000 text-white">
      {/* Container for Posts + Profile Sidebar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minHeight: "100vh",
        }}
      >
        {/* TOP SECTION: Profile card */}
        <Box
          className="w-full bg-mountain-950 rounded-lg p-8"
          sx={{
            overflowY: "auto",
          }}
        >
          <UserProfileCard />
        </Box>

        {/* BOTTOM SECTION: Posts */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                minHeight: 0,
                ".MuiTabs-flexContainer": { gap: 2 },
              }}
            >
              <Tab
                label="All posts"
                sx={{ textTransform: "none", minHeight: 0, minWidth: 0 }}
              />
              <Tab
                label="All blogs"
                sx={{ textTransform: "none", minHeight: 0, minWidth: 0 }}
              />
            </Tabs>
          </Box>
          {selectedTab === 0 && <UserPosts />}
          {selectedTab === 1 && <UserBlogs />}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
