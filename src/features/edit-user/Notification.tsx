import { Box, Typography, Container } from "@mui/material";

export default function Notification() {
    return (
      <Container disableGutters className="min-h-screen bg-[#121212]">
      <Box className="p-6 bg-[#1e1e1e]">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" component="h1" className="dark:text-white font-bold">
          Notification
        </Typography>
      </Box>
      <Typography variant="subtitle1" className="text-gray-400 mt-2">
        This feature is being developed by a frontend senior.
      </Typography>
    </Box>
    </Container>
    )
  }