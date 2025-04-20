// src/features/UserProfile/components/UserBlogs.tsx

import { Box, Typography } from "@mui/material";

const UserBlogs = () => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        No blogs available.
      </Typography>
    </Box>
  );
};

export default UserBlogs;
