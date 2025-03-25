import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  DeleteOutlineOutlined,
  FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import HeroSection from "./components/HeroSection";
import { Crop as CropIcon } from "@mui/icons-material";
import CollectionModal from "./components/CollectionModal";

const MAX_IMAGES = 5;

const UploadMedia: React.FC = () => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showThumbnailOptions, setShowThumbnailOptions] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<
    number | null
  >(null);
  const [artPreviews, setArtPreviews] = useState<string[]>([]);

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

    // Generate preview URLs
    const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));

    // If no thumbnail is set yet, automatically set the first new preview as thumbnail
    if (!thumbnail && newPreviews.length > 0) {
      setThumbnail(newPreviews[0]);
    }

    // Add the new previews to our existing list
    setArtPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews, ...newPreviews];

      // If this is the first image uploaded, automatically select it
      if (prevPreviews.length === 0 && newPreviews.length > 0) {
        setSelectedPreviewIndex(0);
      }

      return updatedPreviews;
    });
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
    <Box className="h-screen w-full  dark:bg-mountain-950">
      {
        <CollectionModal
          open={showCollectionModal}
          onClose={() => setShowCollectionModal(false)}
        />
      }
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <Box
        className="flex p-4  gap-3"
        style={{ height: `${contentHeight}px`, overflow: "hidden" }}
      >
        {/* LEFT COLUMN */}
        <Box className="w-1/2 p-6 flex flex-col dark:bg-mountain-900 bg-mountain-100 rounded-md text-gray-900 dark:text-white items-start">
          {/* -- IMAGES SECTION -- */}
          <Box className="w-full text-gray-900 dark:text-white h-full flex flex-col items-center">
            <Box className="flex justify-between items-center mb-4 w-full">
              <Typography className="text-base text-gray-900 dark:text-mountain-200">
                {artPreviews.length}/{MAX_IMAGES} images
              </Typography>
              {hasSelectedImage && selectedPreviewIndex !== 0 && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<DeleteOutlineOutlined sx={{ fontSize: 18 }} />}
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
                    <CropIcon sx={{ mr: 1 }} />
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
                    <CloudUploadIcon sx={{ mr: 1 }} />
                    Replace image
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
                className="mb-4 bg-mountain-900 rounded h-full w-full"
                sx={{
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
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : (
              <Box
                className="mb-4 border border-dashed border-gray-500 flex flex-col items-center justify-center h-48 w-full h-full"
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFiles = e.dataTransfer.files;
                  if (droppedFiles && droppedFiles.length > 0) {
                    // You may want to wrap the dropped files in a synthetic event object
                    // to use your handleFileChange function, or create a separate handler.
                    handleFileChange({
                      target: { files: droppedFiles },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              >
                {/* Conditionally render big upload button when no images */}
                {showUploadButton && (
                  <>
                    <Button
                      variant="text"
                      component="label"
                      size="small"
                      className="border-mountain-600 mb-2"
                      sx={{
                        backgroundColor: "transparent",
                        color: "white",
                        borderRadius: "10px",
                        border: "1px solid",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                      />
                      <CloudUploadIcon sx={{ mr: 1 }} />
                      <Typography variant="body1" className="text-center">
                        Upload your art
                      </Typography>
                    </Button>
                    <Typography variant="body1" className="text-center">
                      or drag and drop here
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {/* Art Previews Carousel */}
            <Box className="flex gap-2 custom-scrollbar">
              {artPreviews.map((preview, index) => (
                <Box
                  key={index}
                  className="relative cursor-pointer rounded-md border-1"
                  sx={{
                    borderColor:
                      selectedPreviewIndex === index
                        ? "primary.main"
                        : "transparent",
                  }}
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
                    <Box
                      sx={{
                        backgroundColor: "primary.main",
                        position: "absolute",
                        top: "0.25rem",
                        left: "0.25rem",
                        color: "black",
                        fontSize: "0.75rem", // equivalent to text-xs
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
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
                      className="absolute top-0 right-0 bg-gray-600 bg-opacity-70 text-gray-900 dark:text-white hover:bg-gray-700"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}

              {artPreviews.length > 0 && artPreviews.length < MAX_IMAGES && (
                <Box
                  className="w-[80px] h-[80px] flex items-center justify-center border  border-mountain-600 rounded-md text-gray-900 dark:text-white cursor-pointer"
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
            <UploadForm />
          </Box>

          {/* Bottom actions */}
          <Box className="w-full flex mt-auto justify-between pr-4">
            <Button
              variant="outlined"
              className="border-white text-gray-900 dark:text-white hover:bg-mountain-800 flex items-center rounded-md"
              sx={{
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                },
                textTransform: "none",
              }}
              onClick={() => setShowCollectionModal(true)}
              startIcon={<FolderOpenIcon />}
            >
              {/* <span>{"Gallery | My Char Design".substring(0, 13) + "..."}</span> */}
              <div className="flex gap-8 items-center">
                <span>{"Collection".substring(0, 13)}</span>
                <span className="text-mountain-600">Favourites</span>
              </div>
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              className=" rounded-md ml-auto"
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
