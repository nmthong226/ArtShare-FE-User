import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";
import Portfolio from "@/features/UserProfile/components/Portfolio";
import { Box, Typography, Avatar, Button } from "@mui/material";

const UserProfile = () => {
  const { username } = useParams();
  const { user } = useUser();
  const isOwner = user?.username === username;

  return (
    <Box className="min-h-screen sm:px-6 md:px-4 lg:px-6 py-4 bg-black text-white">
      {/* Container for Portfolio + Profile Sidebar */}
      <Box className="flex gap-6">
        {/* LEFT COLUMN: Portfolio */}
        <Box className="w-full md:w-[70%]">
          <Box className="mb-6">
            <Box className="flex items-center  ">
              {["All posts", "All blogs"].map((tab) => (
                <Button
                  key={tab}
                  variant="text"
                  size="small"
                  className="text-white text-sm px-3 py-1 rounded hover:bg-gray-800"
                >
                  {tab}
                </Button>
              ))}
            </Box>
          </Box>

          <Portfolio isOwner={isOwner} />
        </Box>

        {/* RIGHT COLUMN: Profile Sidebar */}
        <Box className="w-full md:w-[30%] bg-[#1a1a1a] rounded-lg p-5">
          {" "}
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
          {/* Bio or more user info can go here */}
          <Box className="mt-6">
            <Typography variant="body2" className="text-gray-300">
              Concept Designer with over 16 years crafting immersive visual
              narratives...
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
