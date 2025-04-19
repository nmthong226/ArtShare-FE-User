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
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, sm: 6, md: 4, lg: 6 },
      }}
    >
      {/* Container for Profile + Posts */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* TOP SECTION: Profile card */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "background.paper",
            borderRadius: 2,
            p: 4,
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ width: 80, height: 80 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Jade
            </Typography>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: "100%",
                  color: "text.secondary",
                }}
              >
                @{username}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              0 Following · 0 Followers
            </Typography>
            {isOwner ? (
              <Button variant="contained" fullWidth>
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button variant="contained" fullWidth>
                  Follow
                </Button>
                <Button variant="outlined" fullWidth>
                  Message
                </Button>
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Concept Designer with over 16 years crafting immersive visual
              narratives...
            </Typography>
          </Box>
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
          {selectedTab === 1 && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No blogs available.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
