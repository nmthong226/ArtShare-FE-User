import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import HeroSection from "./components/HeroSection";
import { CropIcon, TrashIcon, FolderOpenIcon, Trash2Icon } from "lucide-react";

const MAX_IMAGES = 5;

const UploadMedia: React.FC = () => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<
    number | null
  >(null);

  const [artPreviews, setArtPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles) return;

    // Calculate how many images we can still add
    const availableSlots = MAX_IMAGES - artPreviews.length;
    if (availableSlots <= 0) return;

    // Convert FileList to an array and slice only the allowed number of files
    const newFilesArray = Array.from(newFiles).slice(0, availableSlots);

    // (Optional) If you need to update the files state, you might combine newFilesArray with existing files.
    // Here, for simplicity, we update files with the new selection.
    setFiles(newFiles);

    // Generate preview URLs for the allowed files
    const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));
    setArtPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  const handleRemovePreview = (index: number) => {
    setArtPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    if (selectedPreviewIndex === index) {
      setSelectedPreviewIndex(null);
    }
  };

  const handleSelectPreview = (index: number) => {
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

  const showUploadButton = artPreviews.length === 0;
  const hasSelectedImage =
    selectedPreviewIndex !== null && artPreviews[selectedPreviewIndex];

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
        <Box className="w-1/2 p-6 flex flex-col bg-mountain-900 rounded-md text-white">
          <Box className="w-full text-white sticky top-0">
            <Box className="flex justify-between items-center mb-4">
              <Typography className="text-sm text-mountain-200">
                {artPreviews.length}/{MAX_IMAGES} images
              </Typography>
              {hasSelectedImage && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Trash2Icon />}
                  onClick={() => handleRemovePreview(selectedPreviewIndex!)}
                  sx={{ textTransform: "none", color: "#fff" }}
                >
                  Remove image
                </Button>
              )}
            </Box>

            {/* Image Preview */}
            {artPreviews.length > 0 ? (
              <Box className="mb-4">
                <Avatar
                  src={artPreviews[0]}
                  variant="rounded"
                  sx={{ width: "100%", height: 300 }}
                />
              </Box>
            ) : (
              <Box className="mb-4 border border-dashed border-gray-500 flex items-center justify-center h-48">
                <Typography variant="body2" className="text-mountain-200">
                  No images yet
                </Typography>
              </Box>
            )}

            {/* Conditionally render big upload button when no images */}

            {showUploadButton && (
              <>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  className="bg-violet-600 hover:bg-violet-700 mb-2 normal-case"
                  sx={{ textTransform: "none" }}
                >
                  Upload Your Art
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="body1" className="text-center">
                  or drag and drop here
                </Typography>
              </>
            )}

            {/* Art Previews Carousel */}
            <Box className="flex overflow-x-auto mt-4 gap-2 custom-scrollbar">
              {artPreviews.map((preview, index) => (
                <Box
                  key={index}
                  className={`relative cursor-pointer ${
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

              {artPreviews.length > 0 && artPreviews.length < MAX_IMAGES && (
                <Box
                  className="w-[60px] h-[60px] flex items-center justify-center border border-mountain-200 rounded-md text-white cursor-pointer"
                  component="label"
                >
                  <AddIcon />
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>
              )}
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
                  className="text-violet-600"
                />
              }
            >
              <span>Gallery</span>
              <span>|</span>
              <span>My Char Design...</span>
            </Button>

            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              className="bg-violet-600 hover:bg-violet-700 rounded-md"
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
