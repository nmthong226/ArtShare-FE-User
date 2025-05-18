import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import { Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { getUserProfileByUsername, UserProfile } from "./api/user-profile.api";
import { useUser } from "@/contexts/UserProvider";
import { followUser, unfollowUser } from "./api/follow.api";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { AxiosError } from "axios";
import { MouseEvent, useState } from "react";

export const UserProfileCard = () => {
  const { username } = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile", username],
    queryFn: () => getUserProfileByUsername(username),
    enabled: !!username,
  });

  console.log("profile: ", profileData);

  /* ─────────────────── follow / unfollow ────────────── */
  const followMutation = useMutation({
    mutationFn: () => {
      if (!profileData?.id) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return followUser(profileData.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      showSnackbar("Followed successfully.", "success");
    },
    onError: (error: unknown) => {
      let msg = "Failed to follow user.";

      if (error instanceof AxiosError && error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      showSnackbar(msg, "error");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => {
      if (!profileData?.id) {
        return Promise.reject(new Error("User ID is undefined"));
      }
      return unfollowUser(profileData.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      showSnackbar("Unfollow successfully.", "success");
    },
    onError: (error: unknown) => {
      let msg = "Failed to unfollow user.";

      if (error instanceof AxiosError && error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      showSnackbar(msg, "error");
    },
  });

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate()
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReport = () => {
    handleMenuClose();
    console.log("Report user", profileData?.id);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate('/edit-user');
  };

  // Conditional rendering based on loading, error, or data state
  if (isLoading) {
    return (
      <Typography variant="body1" color="textPrimary">
        Loading profile...
      </Typography>
    );
  }

  if (isError) {
    // check if error indicates a 404 (Not Found)
    // to give a more specific "User not found" message.
    // For example, if (error instanceof AxiosError && error.response?.status === 404)
    return (
      <Typography variant="body1" color="textPrimary">
        Error loading profile: {error?.message || "An unknown error occurred"}
      </Typography>
    );
  }

  // If, after loading and no generic error, profileData is still null/undefined,
  // it implies the user was not found by the API or the API returned no data.
  if (!profileData) {
    return (
      <Typography variant="body1" color="textPrimary">
        User profile not found for "{username}".
      </Typography>
    );
  }

  // Now, profileData exists. Check for incompleteness.
  const isProfileIncomplete =
    !profileData.birthday || // Checks if birthday is null, undefined, or an empty string
    !profileData.username || // Checks if username is null, undefined, or an empty string
    !profileData.full_name; // Checks if full_name is null, undefined, or an empty string

  if (isProfileIncomplete) {
    return (
      <Typography variant="body1" color="textPrimary">
        This user hasn't finished setting up their profile.
      </Typography>
    );
  }

  const toggleFollow = () =>
    profileData?.isFollowing
      ? unfollowMutation.mutate()
      : followMutation.mutate();

  const followBtnLoading =
    followMutation.isPending || unfollowMutation.isPending;

  const isOwnProfile = user?.id === profileData?.id;
  const isFollowing = profileData?.isFollowing;

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          {profileData.profile_picture_url ? (
            <ProfileHeader
              name={profileData.full_name}
              username={profileData.username || ""}
              avatarUrl={profileData.profile_picture_url}
              isFollowing={false}
            />
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <ProfileHeader
                name={profileData.full_name}
                username={profileData.username}
                isFollowing={false}
              />
            </Box>
          )}
          <ProfileInfo
            name={profileData.full_name}
            username={profileData.username}
            bio={profileData.bio || ""}
            followings_count={profileData.followings_count}
            followers_count={profileData.followers_count}
            userId={profileData.id}
          />
        </div>
        <Box className="self-start">
          <Box className="flex gap-2">
            {!isOwnProfile && (
              <Tooltip title={isFollowing ? "Unfollow" : "Follow"} arrow>
                <Button
                  onClick={toggleFollow}
                  disabled={followBtnLoading}
                  variant={isFollowing ? "outlined" : "contained"}
                  color="primary"
                  sx={{ borderRadius: "9999px", textTransform: "none" }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </Tooltip>
            )}
            <Tooltip title="More options" arrow>
              <IconButton
                aria-label="More options"
                color="primary"
                size="medium"
                sx={{ borderRadius: "50%", bgcolor: "transparent" }}
                onClick={handleMenuOpen}
              >
                <MoreHorizontal />
              </IconButton>
            </Tooltip>

            <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {isOwnProfile && (
              <MenuItem onClick={handleEdit}>Edit Profile</MenuItem>
            )}
            <MenuItem onClick={handleReport}>Report User</MenuItem>
          </Menu>
          </Box>
        </Box>
      </div>
    </div>
  );
};
