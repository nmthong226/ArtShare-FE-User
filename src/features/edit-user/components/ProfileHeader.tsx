import { Box, Typography } from "@mui/material"
// import { Launch } from "@mui/icons-material"

export function ProfileHeader() {
  return (
    <Box className="p-6 bg-[#1e1e1e]">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" component="h1" className="dark:text-white font-bold">
          Profile
        </Typography>
      </Box>
      <Typography variant="subtitle1" className="text-gray-400 mt-2">
        Update your user profile information if needed
      </Typography>
    </Box>
  )
}