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
import UploadToggle from "./components/UploadToggle.";
import ThumbnailCard from "./components/ThumbnailCard";
import { useSnackbar } from "@/contexts/SnackbarProvider";

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
          {isImageUpload ? (
            // -------- IMAGE UPLOAD FLOW --------

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
                  {!isImageUpload ? (
                    <video
                      src={artPreviews[0]}
                      controls
                      className="w-full h-full rounded"
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
                      className="w-full h-full object-contain"
                    />
                  )}
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
          ) : (
            // -------- VIDEO UPLOAD FLOW --------
            <Box className="w-full h-full flex flex-col gap-4">
              {/* VIDEO player */}
              <Box
                className="rounded bg-black"
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
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <Box
                    className="border border-dashed border-gray-500 flex flex-col items-center justify-center h-full w-full"
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
                    className="mb-2 dark:text-white font-semibold text-base"
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
        <Box className="flex flex-col w-1/2 gap-y-3">
          <Box className="mb-2">
            <UploadToggle
              isImageUpload={isImageUpload}
              onToggle={() => setIsImageUpload((prev) => !prev)}
            />
          </Box>
          {/* Form fields */}
          <Box className="rounded-md custom-scrollbar overflow-y-auto pr-4">
            <UploadForm
              isImageUpload={isImageUpload}
              thumbnail={thumbnail}
              onThumbnailChange={setThumbnail}
              isSubmitted={isSubmitted}
            />
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
