import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";
import UserPosts from "@/features/UserProfile/components/UserPosts";
import { Box, Typography, Avatar, Button, Tabs, Tab } from "@mui/material";
import { useState } from "react";

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
          <Box className="flex flex-col items-center text-center space-y-3">
            <Avatar sx={{ width: 80, height: 80 }} />
            <Typography variant="h6" className="font-semibold">
              Jade
            </Typography>
            <Box
              sx={{
                width: "100%",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                className="text-sm text-gray-400"
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                }}
              >
                @{username}
              </Typography>
            </Box>

            <Typography className="text-sm text-gray-400">
              0 Following · 0 Followers
            </Typography>

            {isOwner ? (
              <Button variant="contained" fullWidth>
                Edit Profile
              </Button>
            ) : (
              <Box className="flex gap-2 w-full">
                <Button variant="contained" fullWidth>
                  Follow
                </Button>
                <Button variant="outlined" fullWidth>
                  Message
                </Button>
              </Box>
            )}
          </Box>

          <Box className="mt-6">
            <Typography variant="body2" className="text-gray-300">
              Concept Designer with over 16 years crafting immersive visual
              narratives...
            </Typography>
          </Box>
        </Box>

        {/* BOTTOM SECTION: Posts */}
        <Box className="w-full">
          <Box className="mb-6">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                minHeight: 0,
                ".MuiTabs-flexContainer": {
                  gap: 2,
                },
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

          <UserPosts />
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
