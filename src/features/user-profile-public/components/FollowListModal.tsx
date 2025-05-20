// src/components/FollowListModal.tsx
import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";

export interface FollowListModalProps {
  open: boolean;
  title: string;
  loading: boolean;
  error?: Error;
  data?: Array<{
    id: string;
    username: string;
    full_name: string | null;
    profile_picture_url: string | null;
  }>;
  onClose: () => void;
}

const FollowListModal: FC<FollowListModalProps> = ({
  open,
  title,
  loading,
  error,
  data,
  onClose,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle sx={{ m: 0, p: 2 }}>
      {title}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
        size="large"
      >
        <X />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : data && data.length > 0 ? (
        <List>
          {data.map((user) => (
            <ListItem key={user.id} component="div" disablePadding>
              <ListItemAvatar>
                <Avatar
                  src={user.profile_picture_url || undefined}
                  alt={user.username}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={user.full_name || ""}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography textAlign="center" color="textSecondary">
          No {title.toLowerCase()} found.
        </Typography>
      )}
    </DialogContent>
  </Dialog>
);

export default FollowListModal;
