import React from "react";
import { Box, Typography } from "@mui/material";
import backgroundImg from "../assets/background.png"; // adjust path

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" className="text-white mb-2">
          Upload Artwork
        </Typography>
        <Typography variant="body1" className="text-white">
          Show the community your blaze
        </Typography>
    </Box>
  );
};

export default HeroSection;
