import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import HeroSection from "./components/HeroSection";
import { FolderOpenIcon, Trash2Icon } from "lucide-react";
import { Crop as CropIcon } from "@mui/icons-material";

const MAX_IMAGES = 5;

const UploadMedia: React.FC = () => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showThumbnailOptions, setShowThumbnailOptions] = useState(false);

  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<
    number | null
  >(null);
  const [artPreviews, setArtPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  // Thumbnail states
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (heroRef.current) {
        const heroHeight = heroRef.current.getBoundingClientRect().height;
        const availableHeight = window.innerHeight - heroHeight;
        setContentHeight(availableHeight);
      }
    };
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  // When user uploads new images
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles) return;

    // Calculate how many images we can still add
    const availableSlots = MAX_IMAGES - artPreviews.length;
    if (availableSlots <= 0) return;

    // Convert FileList to an array, limit by available slots
    const newFilesArray = Array.from(newFiles).slice(0, availableSlots);
    setFiles(newFiles);

    // Generate preview URLs
    const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));

    // If no thumbnail is set yet, automatically set the first new preview as thumbnail
    if (!thumbnail && newPreviews.length > 0) {
      setThumbnail(newPreviews[0]);
    }

    // Add the new previews to our existing list
    setArtPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Remove image from the previews array
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

  // Allow user to upload a different thumbnail
  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  // Placeholder for crop logic
  const handleCropThumbnail = () => {
    alert("Crop functionality is not implemented yet.");
  };

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
        {/* LEFT COLUMN */}
        <Box className="w-1/2 p-6 flex flex-col bg-mountain-900 rounded-md text-white">
          {/* -- IMAGES SECTION -- */}
          <Box className="w-full text-white">
            <Box className="flex justify-between items-center mb-4">
              <Typography className="text-sm text-mountain-200">
                {artPreviews.length}/{MAX_IMAGES} images
              </Typography>
              {hasSelectedImage && selectedPreviewIndex !== 0 && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={
                    <Trash2Icon size={18} className="text-violet-600 " />
                  }
                  onClick={() => handleRemovePreview(selectedPreviewIndex!)}
                  sx={{
                    backgroundColor: "transparent",
                    color: "white",
                    borderRadius: "10px",
                    border: "1px solid",
                    borderColor: "mountain-500",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  Remove image
                </Button>
              )}
              {hasSelectedImage && selectedPreviewIndex === 0 && (
                <Box className="flex gap-1">
                  <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCropThumbnail();
                    }}
                    className="border-mountain-600"
                    sx={{
                      backgroundColor: "transparent",
                      color: "white",
                      borderRadius: "10px",
                      border: "1px solid",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    <CropIcon sx={{ color: "#7c3aed", mr: 1 }} />
                    Crop
                  </Button>
                  <Button
                    variant="text"
                    component="label"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    className="border-mountain-600"
                    sx={{
                      backgroundColor: "transparent",
                      color: "white",
                      borderRadius: "10px",
                      border: "1px solid white",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    <CloudUploadIcon sx={{ color: "#7c3aed", mr: 1 }} />
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={handleThumbnailUpload}
                    />
                  </Button>
                </Box>
              )}
            </Box>

            {/* Main preview of the first image */}
            {artPreviews.length > 0 ? (
              <Box
                className="mb-4 bg-mountain-900 rounded"
                sx={{
                  width: "90%",
                  height: 300,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={
                    selectedPreviewIndex !== null
                      ? artPreviews[selectedPreviewIndex]
                      : artPreviews[0]
                  }
                  alt="Preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
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
                  className={`relative cursor-pointer rounded-md ${
                    selectedPreviewIndex === index
                      ? "border-1 border-mountain-600"
                      : ""
                  }`}
                  onClick={() => {
                    if (index === 0) {
                      // For the thumbnail item: toggle overlay for crop/upload
                      setSelectedPreviewIndex(0);
                      setShowThumbnailOptions(!showThumbnailOptions);
                    } else {
                      setSelectedPreviewIndex(index);
                      handleSelectPreview(index);
                    }
                  }}
                >
                  <Avatar
                    src={preview}
                    className="rounded-md "
                    sx={{ width: 80, height: 80 }}
                  />
                  {index === 0 && (
                    <Box className="absolute top-0.25 left-0.25 bg-violet-600 text-white text-xs px-1 py-0.5 rounded">
                      Thumbnail
                    </Box>
                  )}
                  {index !== 0 && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePreview(index);
                      }}
                      size="medium"
                      className="absolute top-0 right-0 bg-gray-600 bg-opacity-70 text-white hover:bg-gray-700"
                    >
                      <CloseIcon fontSize="medium" />
                    </IconButton>
                  )}
                </Box>
              ))}

              {artPreviews.length > 0 && artPreviews.length < MAX_IMAGES && (
                <Box
                  className="w-[80px] h-[80px] flex items-center justify-center border  border-mountain-600 rounded-md text-white cursor-pointer"
                  component="label"
                >
                  <AddIcon fontSize="large" />
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

        {/* RIGHT COLUMN: FORM FIELDS & ACTIONS */}
        <Box className="flex flex-col w-1/2 gap-y-3">
          {/* Form fields */}
          <Box className="rounded-md custom-scrollbar overflow-y-auto pr-4">
            <UploadForm files={files} />
          </Box>

          {/* Bottom actions */}
          <Box className="w-full flex mt-auto justify-between pr-4">
            <Button
              variant="outlined"
              className="border-white text-white hover:bg-white hover:text-black flex items-center space-x-2 rounded-md"
              sx={{
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                },
                textTransform: "none",
              }}
              startIcon={<FolderOpenIcon className="text-violet-600" />}
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
