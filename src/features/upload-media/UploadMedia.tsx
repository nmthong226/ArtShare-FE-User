import React, { useRef, useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  DeleteOutlineOutlined,
  FolderOpen as FolderOpenIcon,
  SetMealOutlined,
} from "@mui/icons-material";
import { IoVideocam } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import { Crop as CropIcon } from "@mui/icons-material";
import CollectionModal from "./components/CollectionModal";
import ThumbnailCard from "./components/ThumbnailCard";
import { useSnackbar } from "@/context/SnackbarProvider";

const MAX_IMAGES = 5;

const UploadMedia: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showThumbnailOptions, setShowThumbnailOptions] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<
    number | null
  >(null);
  const [artPreviews, setArtPreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const { showSnackbar } = useSnackbar();
  // Thumbnail states
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [description, setDescription] = useState("");

  const [imageFiles, setImageFiles] = useState<FileList | undefined>(undefined);
  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);

  const THUMBNAIL_HINT =
    "Recommended: 720x1280 (vertical), less than 2MB, JPG/PNG/GIF format, 9:16 ratio";

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

    const allMedia = [...artPreviews, ...videoPreviews];

    const formData = new FormData();

    // Append form data fields
    formData.append("title", title);
    formData.append("description", description);
    formData.append("cate_ids", JSON.stringify([1, 2]));
    formData.append("images", new Blob([imageFiles]));

    console.log("Submitting media:", allMedia);
  };

  const handleImageFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

    setImageFiles(newFiles);

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

  const handleVideoFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;
    const videoFile = newFiles[0];

    const videoURL = URL.createObjectURL(videoFile);
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

      setVideoPreviews([videoURL]);
      setVideoFile(videoFile); // ✅ Optional: useful if needed later
      extractThumbnail(videoFile);

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

  const isMediaValid = isImageUpload
    ? artPreviews.length > 0
    : artPreviews.length > 0 && thumbnail !== null;

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
              className={`flex items-center justify-start px-2 border rounded-sm w-1/2 transition-all duration-300 ${
                isImageUpload
                  ? "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white"
                  : "bg-gray-900 text-gray-500 opacity-50"
              }`}
              sx={{
                borderColor: isImageUpload ? "#4F46E5" : "#4B5563",
                borderRadius: "2px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: isImageUpload ? undefined : "#374151", // darker gray
                },
              }}
            >
              <IoMdImage className="mr-2 w-8 h-8" />
              <p className="text-sm">
                Upload image{" "}
                <span
                  className={`${
                    isImageUpload ? "text-mountain-300" : "text-gray-600"
                  }`}
                >
                  ( .png, .jpg, .jpeg, ... )
                </span>
              </p>
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={() => setIsImageUpload(false)}
              className={`flex items-center justify-start px-2 border rounded-sm w-1/2 transition-all duration-300 ${
                !isImageUpload
                  ? "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white"
                  : "bg-gray-900 text-gray-500 opacity-50"
              }`}
              sx={{
                borderColor: !isImageUpload ? "#4F46E5" : "#4B5563",
                borderRadius: "2px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: !isImageUpload ? undefined : "#374151",
                },
              }}
            >
              <IoVideocam className="mr-2 w-8 h-8" />
              <p className="text-sm">
                Upload video{" "}
                <span
                  className={`${
                    !isImageUpload ? "text-mountain-300" : "text-gray-600"
                  }`}
                >
                  ( .mp4, .avi, .mov, ... )
                </span>
              </p>
            </Button>
          </div>
          <hr className="my-4 border-mountain-700 border-t-1 w-full" />
          {isImageUpload ? (
            // -------- IMAGE UPLOAD FLOW --------
            <Box className="flex flex-col items-center w-full h-full text-gray-900 dark:text-white">
              <Box className="flex justify-between items-center w-full">
                <Typography className="text-gray-900 dark:text-mountain-200 text-base">
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
                      className="border-mountain-600 dark:text-white text-black"
                      sx={{
                        backgroundColor: "transparent",
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
                      className="border-mountain-600 dark:text-white text-black"
                      sx={{
                        backgroundColor: "transparent",
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
                  className="bg-mountain-100 dark:bg-mountain-900 mb-4 rounded w-full flex flex-col"
                  sx={{
                    maxHeight: {
                      xs: 300, // mobile
                      sm: 360, // small tablets
                      md: 420, // medium desktops
                      lg: 480, // large screens
                    },
                    p: 2,
                    gap: 1,
                    overflow: "hidden",
                  }}
                >
                  {/* Preview area */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      minHeight: 100,
                    }}
                  >
                    {selectedPreviewIndex !== null &&
                    artPreviews[selectedPreviewIndex] ? (
                      <img
                        src={artPreviews[selectedPreviewIndex]}
                        alt="Preview"
                        className="w-full max-h-full object-contain"
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    ) : null}
                  </Box>

                  {/* Art Previews Carousel */}
                  <Box
                    className="flex gap-2 custom-scrollbar"
                    sx={{
                      flexShrink: 0,

                      overflowX: "auto",

                      mt: 1,
                    }}
                  >
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
                          setSelectedPreviewIndex(index);
                        }}
                      >
                        <Avatar
                          src={preview}
                          className="rounded-md"
                          sx={{ width: 80, height: 80 }}
                        />
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

                    {artPreviews.length > 0 &&
                      artPreviews.length < MAX_IMAGES && (
                        <Box
                          className="flex justify-center items-center border border-mountain-600 rounded-md w-[80px] h-[80px] text-gray-900 dark:text-white cursor-pointer"
                          component="label"
                        >
                          <AddIcon fontSize="large" />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={handleImageFilesChange}
                          />
                        </Box>
                      )}
                  </Box>
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
                      handleImageFilesChange({
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
                          accept="image/*"
                          hidden
                          onChange={handleImageFilesChange}
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
            </Box>
          ) : (
            // -------- VIDEO UPLOAD FLOW --------
            <Box
              className="relative w-full border border-gray-500 border-dashed rounded-md flex flex-col"
              sx={{
                aspectRatio: "9 / 16", // Optional: keeps a vertical shape for empty state
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFiles = e.dataTransfer.files;
                if (droppedFiles?.[0]) {
                  handleImageFilesChange({
                    target: { files: droppedFiles },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              {videoPreviews.length > 0 ? (
                <video
                  src={videoPreviews[0]}
                  controls
                  className="rounded w-full h-full object-contain"
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
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
                      accept="video/*"
                      hidden
                      onChange={handleVideoFileChange}
                    />
                    <CloudUploadIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" className="text-center">
                      Upload your video
                    </Typography>
                  </Button>
                  <Typography variant="body1" className="text-center">
                    or drag and drop here
                  </Typography>
                </>
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
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
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
              disabled={!isMediaValid}
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
