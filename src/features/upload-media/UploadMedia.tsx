import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import UploadForm from "./components/UploadForm.tsx"; // Adjust import path as needed
import HeroSection from "./components/HeroSection.tsx";

const UploadMedia: React.FC = () => {
  // Keep files in state so we can pass them to the form if needed
  const [files, setFiles] = useState<FileList | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
    console.log("Selected files:", event.target.files);
  };

  return (
    <Box className="w-full min-h-screen">
      {/* 
        1) HERO / BACKGROUND SECTION 
        - Displays the background image 
        - Text: "Upload Media" + "Show the community your blaze"
      */}
     <HeroSection />

      {/* 
        2) CONTENT SECTION (the two-column layout) 
        - Left: Upload area 
        - Right: Form fields 
      */}
      <Box className="flex w-full min-h-screen bg-gray-50">
        {/* Left side: Upload area */}
        <Box className="w-2/3 p-6 flex flex-col items-center justify-center bg-gray-900 text-white border-r border-gray-700">
          <Typography variant="h5" className="mb-2">
            Upload Your Media
          </Typography>
          <Typography variant="body1" className="mb-4 text-center">
            Drag and drop your files here <br />
            or click below to browse
          </Typography>

          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Select Files
            <input type="file" multiple hidden onChange={handleFileChange} />
          </Button>
        </Box>

        {/* Right side: Form fields */}
        <Box className="w-1/3 p-6">
          <UploadForm files={files} />
        </Box>
      </Box>
    </Box>
  );
};

export default UploadMedia;
