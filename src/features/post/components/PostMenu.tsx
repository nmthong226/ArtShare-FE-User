import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

export const PostMenu = ({
  isOwner,
  onEdit,
  onDelete,
  onReport,
}: {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    handleCloseMenu();
    // Delay opening dialog to let Menu close first
    setTimeout(() => {
      setConfirmOpen(true);
    }, 100); // 100ms is enough for MUI menu fade-out
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDelete = () => {
    setConfirmOpen(false);
    onDelete();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <EllipsisVertical />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {isOwner ? (
          <>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                onEdit();
              }}
            >
              Edit
            </MenuItem>
            <MenuItem onClick={handleConfirmDelete}>Delete</MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onReport();
            }}
          >
            Report
          </MenuItem>
        )}
      </Menu>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
