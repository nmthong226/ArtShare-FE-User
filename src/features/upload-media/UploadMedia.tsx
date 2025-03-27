import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  DeleteOutlineOutlined,
  FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import { IoVideocam } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import HeroSection from "./components/HeroSection";
import { Crop as CropIcon } from "@mui/icons-material";
import CollectionModal from "./components/CollectionModal";
import UploadToggle from "./components/UploadToggle.";
import ThumbnailCard from "./components/ThumbnailCard";
import { useSnackbar } from "@/context/SnackbarProvider";

const MAX_IMAGES = 5;

const UploadMedia: React.FC = () => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showThumbnailOptions, setShowThumbnailOptions] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<
    number | null
  >(null);
  const [artPreviews, setArtPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const { showSnackbar } = useSnackbar();
  // Thumbnail states
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const THUMBNAIL_HINT =
    "Recommended: 720x1280 (vertical), less than 2MB, JPG/PNG/GIF format, 9:16 ratio";

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

  const extractThumbnail = (videoFile: File) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const url = URL.createObjectURL(videoFile);

    video.src = url;
    video.crossOrigin = "anonymous";
    video.load();

    video.onloadeddata = () => {
      video.currentTime = 0;
      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/png");
        setThumbnail(thumbnailUrl);
        URL.revokeObjectURL(url);
      };
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    if (!title.trim()) {
      showSnackbar("Title is required.", "error");
      return;
    }

    // Continue with submission...
  };
  // When user uploads new images
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

    const firstFile = newFiles[0];
    const fileNameWithoutExt = firstFile.name.replace(/\.[^/.]+$/, "");

    // Set title if it's empty
    if (!title) {
      setTitle(fileNameWithoutExt);
    }

    // --- VIDEO MODE ---
    if (!isImageUpload) {
      if (!firstFile.type.startsWith("video/")) return;

      const videoURL = URL.createObjectURL(firstFile);
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        // Duration check (15s–60s)
        if (duration < 15 || duration > 60) {
          showSnackbar("Video must be between 15 and 60 seconds.", "error");
          URL.revokeObjectURL(videoURL);
          return;
        }

        // Aspect ratio check for Shorts (9:16 ≈ 0.5625)
        const ratio = width / height;
        const isShortRatio = ratio <= 0.58; // Allow some tolerance

        if (!isShortRatio) {
          showSnackbar(
            "Recommended format is vertical (9:16) like YouTube Shorts.",
            "info"
          );
        }

        setArtPreviews([videoURL]);
        extractThumbnail(firstFile);

        videoElement.currentTime = 0;
        videoElement.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL("image/png");
            setThumbnail(imageUrl);
          }
        };
      };

      videoElement.src = videoURL;
      return;
    }

    // --- IMAGE MODE ---
    const availableSlots = MAX_IMAGES - artPreviews.length;
    if (availableSlots <= 0) return;

    const newFilesArray = Array.from(newFiles).slice(0, availableSlots);
    const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));

    if (!thumbnail && newPreviews.length > 0) {
      setThumbnail(newPreviews[0]);
    }

    setArtPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews, ...newPreviews];

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
    showSnackbar("Crop functionality is not implemented yet.", "info");
  };

  const showUploadButton = artPreviews.length === 0;
  const hasSelectedImage =
    selectedPreviewIndex !== null && artPreviews[selectedPreviewIndex];

  return (
    <Box className="dark:bg-mountain-950 w-full h-full">
      {
        <CollectionModal
          open={showCollectionModal}
          onClose={() => setShowCollectionModal(false)}
        />
      }
      {/* <div ref={heroRef}>
        <HeroSection />
      </div> */}
      <Box
        className="flex gap-3 p-4 w-full h-[calc(100vh-4rem)]"
        style={{ overflow: "hidden" }}
      >
        {/* LEFT COLUMN */}
        <Box className="flex flex-col items-start bg-mountain-100 dark:bg-mountain-900 p-6 rounded-md w-[60%] h-full text-gray-900 dark:text-white">
          <div className="flex gap-x-1 w-full h-14">
            <Button
              variant="text"
              size="small"
              onClick={() => setIsImageUpload(true)}
              className={`flex items-center justify-start px-2 border border-mountain-700 rounded-sm w-1/2 transition-all duration-300
          ${isImageUpload ? "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-mountain-50" : "bg-gradient-to-r from-mountain-950 via-mountain-900 to-mountain-1000 text-mountain-300"}`}
              sx={{
                borderRadius: "2px",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <IoMdImage className="mr-2 w-8 h-8" />
              <p className="text-sm">
                Upload Image <span className="text-mountain-300">( .png, .jpg, .jpeg, ... )</span>
              </p>
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => setIsImageUpload(false)}
              className={`flex items-center justify-start px-2 border border-mountain-700 rounded-sm w-1/2  transition-all duration-300
          ${!isImageUpload ? "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-mountain-50" : "bg-gradient-to-r from-mountain-950 via-mountain-900 to-mountain-1000 text-mountain-300"}`}
              sx={{
                borderRadius: "2px",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <IoVideocam className="mr-2 w-8 h-8" />
              <p className="text-sm">
                Upload Video <span className="text-mountain-300">( .mp4, .avi, .mov, ... )</span>
              </p>
            </Button>
          </div>
          <hr className="my-4 border-mountain-700 border-t-1 w-full"/>
          {isImageUpload ? (
            // -------- IMAGE UPLOAD FLOW --------
            <Box className="flex flex-col items-center w-full h-full text-gray-900 dark:text-white">
              <Box className="flex justify-between items-center w-full">
                {/* <Typography className="text-gray-900 dark:text-mountain-200 text-base">
                  {artPreviews.length}/{MAX_IMAGES} images
                </Typography> */}
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
                  className="bg-mountain-900 mb-4 rounded w-full h-full"
                  sx={{
                    height: 300,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {!isImageUpload ? (
                    <video
                      src={artPreviews[0]}
                      controls
                      className="rounded w-full h-full"
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <img
                      src={
                        selectedPreviewIndex !== null
                          ? artPreviews[selectedPreviewIndex]
                          : artPreviews[0]
                      }
                      alt="Preview"
                      className="w-full max-h-96 object-contain"
                    />
                  )}
                </Box>
              ) : (
                <Box
                  className="flex flex-col justify-center items-center mb-4 border border-gray-500 border-dashed w-full h-full"
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
                        className="mb-2 border-mountain-600"
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
                    className="relative border-1 rounded-md cursor-pointer"
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
                      className="rounded-md"
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
                        className="top-0 right-0 absolute bg-gray-600 hover:bg-gray-700 bg-opacity-70 text-gray-900 dark:text-white"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                {artPreviews.length > 0 && artPreviews.length < MAX_IMAGES && (
                  <Box
                    className="flex justify-center items-center border border-mountain-600 rounded-md w-[80px] h-[80px] text-gray-900 dark:text-white cursor-pointer"
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
          ) : (
            // -------- VIDEO UPLOAD FLOW --------
            <Box className="flex flex-col items-center w-full h-full text-gray-900 dark:text-white">
              {/* VIDEO player */}
              <Box
                className="bg-black rounded"
                sx={{
                  height: 300,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {artPreviews.length > 0 ? (
                  <video
                    src={artPreviews[0]}
                    controls
                    className="rounded w-full h-full object-contain"
                  />
                ) : (
                  <Box
                    className="flex flex-col justify-center items-center border border-gray-500 border-dashed w-full h-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFiles = e.dataTransfer.files;
                      if (droppedFiles?.[0]) {
                        handleFileChange({
                          target: { files: droppedFiles },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                  >
                    <Button
                      variant="text"
                      component="label"
                      className="mb-2 border-mountain-600"
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
                        accept="video/*"
                        hidden
                        onChange={handleFileChange}
                      />
                      <CloudUploadIcon sx={{ mr: 1 }} />
                      <Typography>Upload your video</Typography>
                    </Button>
                    <Typography>or drag and drop here</Typography>
                  </Box>
                )}
              </Box>
              {!isImageUpload && artPreviews.length > 0 && (
                <Box className="mt-4">
                  <Typography
                    variant="body2"
                    className="mb-2 font-semibold dark:text-white text-base"
                  >
                    Thumbnail
                  </Typography>

                  <ThumbnailCard
                    thumbnail={thumbnail || undefined}
                    onUpload={handleThumbnailUpload}
                    onChange={() =>
                      document.getElementById("thumbnail-upload")?.click()
                    }
                    onDownload={() => {
                      if (thumbnail) {
                        const a = document.createElement("a");
                        a.href = thumbnail;
                        a.download = "thumbnail.png";
                        a.click();
                      }
                    }}
                  />
                  <Typography variant="caption" color="gray">
                    {THUMBNAIL_HINT}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* RIGHT COLUMN: FORM FIELDS & ACTIONS */}
        <Box className="flex flex-col space-y-3 w-[40%]">
          {/* <Box className="mb-2">
            <UploadToggle
              isImageUpload={isImageUpload}
              onToggle={() => setIsImageUpload((prev) => !prev)}
            />
          </Box> */}
          {/* Form fields */}
          <Box className="pr-4 rounded-md overflow-y-auto custom-scrollbar">
            <UploadForm
              isImageUpload={isImageUpload}
              thumbnail={thumbnail}
              onThumbnailChange={setThumbnail}
              isSubmitted={isSubmitted}
            />
          </Box>

          <hr className="border-mountain-300 dark:border-mountain-700 border-t-1 w-full" />

          {/* Bottom actions */}
          <Box className="flex justify-between mt-auto pr-4 w-full">
            <Button
              variant="outlined"
              className="flex items-center hover:bg-mountain-800 border-white rounded-md text-gray-900 dark:text-white"
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
              <div className="flex items-center gap-8">
                <span>{"Collection".substring(0, 13)}</span>
                <span className="text-mountain-600">Favourites</span>
              </div>
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              className="ml-auto rounded-md"
              onClick={handleSubmit}
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
