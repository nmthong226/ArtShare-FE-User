import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import HeroSection from "./components/HeroSection";
import { CropIcon, DeleteIcon, FolderOpenIcon } from "lucide-react";

const UploadMedia: React.FC = () => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(null);
  const [artPreviews, setArtPreviews] = useState<string[]>([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setArtPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemovePreview = (index) => {
    setArtPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    if (selectedPreviewIndex === index) {
      setSelectedPreviewIndex(null);
    }
  };

  const handleSelectPreview = (index) => {
    setSelectedPreviewIndex(index);
  };

  useEffect(() => {
    const calculateHeight = () => {
      if (heroRef.current) {
        const heroHeight = heroRef.current.getBoundingClientRect().height;
        const availableHeight = window.innerHeight - heroHeight;
        setContentHeight(availableHeight);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight); // Recalculate on window resize

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  return (
    <Box className="h-screen w-full">
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <Box
        className="flex p-4 bg-mountain-950 gap-3"
        style={{ height: `${contentHeight}px`, overflow: "hidden" }}
      >
        {/* Left side: Upload area */}
        <Box className="w-1/2 p-6 flex flex-col items-center bg-mountain-900 rounded-md">
          <Box className="w-full text-white sticky top-0">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="body2">
                {artPreviews.length}/{5} images
              </Typography>
              {selectedPreviewIndex !== null ? (
                <Box>
                  <IconButton size="small">
                    <CropIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ ml: 1, textTransform: "none" }}
                  >
                    Upload
                  </Button>
                </Box>
              ) : (
                <Box>
                  <IconButton
                    onClick={() => handleRemovePreview(selectedPreviewIndex)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    Remove image
                  </Button>
                </Box>
              )}
            </Box>

            {/* Image Preview */}
            {artPreviews.length > 0 && (
              <Box className="mb-4">
                <Avatar
                  src={artPreviews[0]}
                  variant="rounded"
                  sx={{ width: "100%", height: 300 }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              className="bg-indigo-600 hover:bg-indigo-700 mb-2"
              sx={{ textTransform: "none" }}
            >
              Upload Your Art
              <input type="file" multiple hidden onChange={handleFileChange} />
            </Button>
            <Typography variant="body1" className="text-center">
              or drag and drop here
            </Typography>

            {/* Art Previews Carousel */}
            <Box className="flex overflow-x-auto mt-4">
              {artPreviews.map((preview, index) => (
                <Box
                  key={index}
                  className={`mr-2 relative cursor-pointer ${
                    selectedPreviewIndex === index
                      ? "border-2 border-indigo-500"
                      : ""
                  }`}
                  onClick={() => handleSelectPreview(index)}
                >
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePreview(index);
                    }}
                    size="small"
                    className="absolute top-0 right-0 bg-gray-600 bg-opacity-70 text-white hover:bg-gray-700"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <IconButton component="label">
                <AddIcon />
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
        {/* Right side: Form fields */}
        <Box className="flex flex-col w-1/2 gap-y-3">
          <Box className="rounded-md custom-scrollbar overflow-y-auto pr-4 ">
            <UploadForm files={files} />
          </Box>
          <Box className="w-full flex mt-auto  justify-between pr-4">
            <Button
              variant="outlined"
              // Outline + text in white, with hover styling:
              className="
                border-white 
                text-white 
                hover:bg-white 
                hover:text-black 
                flex 
                items-center 
                space-x-2
                rounded-md
              "
              // Force the border color in case MUI overrides:
              sx={{
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                },
                textTransform: "none",
              }}
              startIcon={
                <FolderOpenIcon
                  // Purple icon color
                  className="text-[#9e4bff]"
                />
              }
            >
              <span>Gallery</span>
              <span>|</span>
              <span>My Char Design...</span>
            </Button>

            <Button
              variant="contained"
              // onClick={handleSubmit} // The handleSubmit logic is in UploadForm
              sx={{ textTransform: "none" }}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadMedia;
