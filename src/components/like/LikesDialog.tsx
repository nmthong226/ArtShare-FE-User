import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { LikingUser } from "./types/user";
import { fetchLikingUsersMock } from "./mocks/likes.api.mock";

interface LikesDialogProps {
  postId: number | null;
  open: boolean;
  onClose: () => void;
}

export const LikesDialog: React.FC<LikesDialogProps> = ({
  postId,
  open,
  onClose,
}) => {
  const [likingUsers, setLikingUsers] = useState<LikingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [followStatus, setFollowStatus] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [followingInProgress, setFollowingInProgress] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (open && postId) {
      setLoading(true);
      setError(null);
      setLikingUsers([]);
      setFollowStatus(new Map());

      fetchLikingUsersMock(postId)
        .then((users) => {
          setLikingUsers(users);

          const initialFollowStatus = new Map<string, boolean>();
          users.forEach((user) => {
            initialFollowStatus.set(user.id, user.is_following ?? false);
          });
          setFollowStatus(initialFollowStatus);
        })
        .catch((err) => {
          console.error("Failed to fetch likes:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load likes. Please try again.",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLikingUsers([]);
      setError(null);
      setLoading(false);
      setFollowStatus(new Map());
      setFollowingInProgress(new Set());
    }
  }, [open, postId]);

  const handleClose = () => {
    onClose();
  };

  const handleFollowToggle = async (userIdToToggle: string) => {
    const currentlyFollowing = followStatus.get(userIdToToggle) ?? false;
    const action = currentlyFollowing ? "unfollow" : "follow";

    if (followingInProgress.has(userIdToToggle)) return;

    setFollowingInProgress((prev) => new Set(prev).add(userIdToToggle));

    setFollowStatus((prev) =>
      new Map(prev).set(userIdToToggle, !currentlyFollowing),
    );

    try {
      console.log(
        `[API Call Placeholder] User ${action}s user ${userIdToToggle}`,
      );
      const response = await fetch(`/api/users/${userIdToToggle}/${action}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action}`);
      }

      console.log(`Successfully ${action}ed user ${userIdToToggle}`);
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);

      setFollowStatus((prev) =>
        new Map(prev).set(userIdToToggle, currentlyFollowing),
      );
    } finally {
      setFollowingInProgress((prev) => {
        const next = new Set(prev);
        next.delete(userIdToToggle);
        return next;
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="likes-dialog-title"
      maxWidth="xs"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "70vh" } }}
    >
      <DialogTitle
        id="likes-dialog-title"
        className="flex justify-between items-center"
      >
        Likes
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {/* Remove padding for List */}
        {loading && (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" className="m-4">
            {/* Add margin for Alert */}
            {error}
          </Alert>
        )}
        {!loading &&
          !error &&
          (likingUsers.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center p-4"
            >
              No one has liked this post yet.
            </Typography>
          ) : (
            <List dense disablePadding>
              {/* dense reduces spacing, disablePadding */}
              {likingUsers.map((user) => {
                const isFollowing = followStatus.get(user.id) ?? false;
                const isProcessingFollow = followingInProgress.has(user.id);

                return (
                  <ListItem
                    key={user.id}
                    sx={{ px: 2, py: 1 }}
                    secondaryAction={
                      /* !isCurrentUser && */
                      <Button
                        size="small"
                        variant={isFollowing ? "outlined" : "contained"}
                        color="primary"
                        onClick={() => handleFollowToggle(user.id)}
                        disabled={isProcessingFollow}
                        sx={{ minWidth: 80, textTransform: "none" }}
                      >
                        {isProcessingFollow ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : isFollowing ? (
                          "Following"
                        ) : (
                          "Follow"
                        )}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={user.username}
                        src={user.profile_picture_url || undefined}
                        className="w-10 h-10"
                      >
                        {/* Fallback for missing picture_url */}
                        {!user.profile_picture_url &&
                          user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          className="font-medium truncate"
                        >
                          {/* Display full_name if available, otherwise username */}
                          {user.full_name || user.username}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="text-xs truncate"
                        >
                          {/* Prepend '@' to the username for clarity */}@
                          {user.username}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          ))}
      </DialogContent>
    </Dialog>
  );
};
