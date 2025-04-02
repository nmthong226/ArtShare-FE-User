import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  DeleteOutlineOutlined,
  FolderOpen as FolderOpenIcon,
  Loop,
} from "@mui/icons-material";
import { IoVideocam } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import CollectionModal from "./components/CollectionModal";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { createPost } from "./api/createPost";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const MAX_IMAGES = 5;

const UploadMedia: React.FC = () => {
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

  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  // const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaOrder, setMediaOrder] = useState<string[]>([]); // values: "image" or "video"

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
  const createFormData = (
    title: string,
    description: string,
    imageFiles: FileList
  ) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("cate_ids", JSON.stringify([1, 2]));

    Array.from(imageFiles).forEach((file) => {
      formData.append("images", file);
    });

    return formData;
  };

  // Function to handle the post creation API call
  const handleCreatePost = async (formData: FormData) => {
    try {
      setIsLoading(true); // Show loading screen
      const response = await createPost(formData);
      console.log("Post created:", response);
      showSnackbar("Post created successfully!", "success");
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar("Failed to create post.", "error");
    } finally {
      setIsLoading(false); // Hide loading screen
    }
  };

  // Function to handle the form submission
  const handleSubmit = () => {
    setIsSubmitted(true);

    // Validation for required fields
    if (!title.trim()) {
      showSnackbar("Title is required.", "error");
      return;
    }

    if (!imageFiles || imageFiles.length === 0) {
      // if (!videoFile) {
      //   showSnackbar("At least one image or video is required.", "error");
      // }
      return;
    }
    const formData = createFormData(title, description, imageFiles);

    // Send the request to create the post
    handleCreatePost(formData);
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

    setImageFiles(newFiles);

    setArtPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews, ...newPreviews];

      // Only set thumbnail if there is no media yet
      if (mediaOrder.length === 0 && newPreviews.length > 0) {
        setThumbnail(newPreviews[0]);
        setMediaOrder((prev) => [...prev, "image"]);
      }

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
    const file = newFiles[0];
    const url = URL.createObjectURL(file);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.crossOrigin = "anonymous";

    video.oncanplay = () => {
      const duration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (duration < 15 || duration > 60) {
        showSnackbar("Video must be between 15 and 60 seconds.", "error");
        URL.revokeObjectURL(url);
        return;
      }

      const ratio = width / height;
      const expectedRatio = 9 / 16;
      const ratioDifference = Math.abs(ratio - expectedRatio);

      if (ratioDifference > 0.05) {
        showSnackbar(
          "Video must have a 9:16 aspect ratio (vertical format).",
          "error"
        );
        URL.revokeObjectURL(url);
        return;
      }

      // setVideoFile(file);
      setVideoPreviews([url]);

      if (mediaOrder.length === 0) {
        extractThumbnail(file);
        setMediaOrder((prev) => [...prev, "video"]);
      }
    };

    video.onerror = () => {
      showSnackbar("Invalid video file.", "error");
      URL.revokeObjectURL(url);
    };
  };

  // Remove image from the previews array
  const handleRemovePreview = (index: number) => {
    setArtPreviews((prevPreviews) => {
      const updated = prevPreviews.filter((_, i) => i !== index);
      if (updated.length === 0 && videoPreviews.length === 0) {
        setThumbnail(null);
        setMediaOrder([]);
      }
      return updated;
    });

    if (selectedPreviewIndex === index) {
      setSelectedPreviewIndex(null);
    }
  };

  const showUploadButton = artPreviews.length === 0;
  const hasSelectedImage =
    selectedPreviewIndex !== null && artPreviews[selectedPreviewIndex];

  const isMediaValid = isImageUpload
    ? artPreviews.length > 0
    : videoPreviews.length > 0 && thumbnail !== null;

  return (
    <Box className="dark:bg-mountain-950 w-full h-full">
      {isLoading && (
        <Backdrop
          open
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.modal + 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            flexDirection: "column",
            backdropFilter: "blur(3px)",
          }}
        >
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
            Creating post...
          </Typography>
        </Backdrop>
      )}
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
        <Box className="flex flex-col items-start bg-mountain-100 dark:bg-mountain-900 px-6 py-3 rounded-md w-[60%] h-full text-gray-900 dark:text-white">
          <div className="flex gap-x-1 w-full h-14">
            <Button
              variant="text"
              size="small"
              onClick={() => setIsImageUpload(true)}
              className={`flex items-center justify-start px-2 border rounded-sm w-1/2 transition-all duration-300 ${
                isImageUpload
                  ? "bg-indigo-800 text-white"
                  : "bg-gray-900 text-gray-500 opacity-50"
              }`}
              sx={{
                height: 40,
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
                  ? "bg-indigo-800 text-white"
                  : "bg-gray-900 text-gray-500 opacity-50"
              }`}
              sx={{
                height: 40,
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
          <hr className="my-2 border-mountain-700 border-t-1 w-full" />
          {isImageUpload ? (
            // -------- IMAGE UPLOAD FLOW --------
            <Box className="items-center w-full h-full text-gray-900 dark:text-white overflow-hidden flex flex-col">
              {/* Top row (info + delete button) */}
              <Box
                className="flex justify-between items-center w-full mb-2"
                sx={{ flexShrink: 0 }}
              >
                <Typography className="text-gray-900 dark:text-mountain-200 text-base">
                  {artPreviews.length}/{MAX_IMAGES} images
                </Typography>
                {hasSelectedImage && (
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
              </Box>

              {/* Main Preview Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  minHeight: 0,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {artPreviews.length > 0 ? (
                  selectedPreviewIndex !== null &&
                  artPreviews[selectedPreviewIndex] ? (
                    <img
                      src={artPreviews[selectedPreviewIndex]}
                      alt="Preview"
                      className="w-full object-contain"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  ) : null
                ) : (
                  <Box
                    className="flex flex-col justify-center items-center border border-gray-500 border-dashed w-full h-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFiles = e.dataTransfer.files;
                      if (droppedFiles && droppedFiles.length > 0) {
                        handleImageFilesChange({
                          target: { files: droppedFiles },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                  >
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

              {/* Carousel (thumbnails) */}
              <Box
                className="flex gap-2 custom-scrollbar mt-2"
                sx={{
                  flexShrink: 0,
                  overflowX: "auto",
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

                {artPreviews.length > 0 && artPreviews.length < MAX_IMAGES && (
                  <Box
                    className="flex justify-center items-center border border-mountain-600 rounded-md w-[80px] h-[80px] text-gray-900 dark:text-white cursor-pointer"
                    component="label"
                  >
                    <AddIcon fontSize="large" />
                    <input
                      accept="image/*"
                      type="file"
                      multiple
                      hidden
                      onChange={handleImageFilesChange}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            // -------- VIDEO UPLOAD FLOW --------
            <Box
              className={`relative w-full rounded-md flex flex-col ${
                videoPreviews.length === 0
                  ? "border border-gray-500 border-dashed"
                  : ""
              }`}
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
                  handleVideoFileChange({
                    target: { files: droppedFiles },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              {videoPreviews.length > 0 ? (
                <Box className="relative w-full h-full">
                  {/* Video preview */}
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

                  {/* Replace video button */}
                  <Button
                    component="label"
                    variant="text"
                    size="small"
                    startIcon={<Loop sx={{ fontSize: 18 }} />}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      backgroundColor: "transparent",
                      color: "white",
                      borderRadius: "10px",
                      border: "1px solid",
                      borderColor: "mountain-500",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    Replace video
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={handleVideoFileChange}
                    />
                  </Button>
                </Box>
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
              className="flex items-center hover:bg-mountain-800 dark:border-white border-black rounded-md text-gray-900 dark:text-white"
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
              onClick={handleSubmit}
              disabled={!isMediaValid}
              className="ml-auto rounded-md"
              sx={{
                textTransform: "none",
                background: !isMediaValid
                  ? "linear-gradient(to right, #9ca3af, #6b7280)" // Tailwind's gray-400 to gray-500
                  : "linear-gradient(to right, #3730a3, #5b21b6, #4c1d95)", // indigo-violet gradient
                color: "white",
                opacity: !isMediaValid ? 0.6 : 1,
                pointerEvents: !isMediaValid ? "none" : "auto",
                "&:hover": {
                  background: !isMediaValid
                    ? "linear-gradient(to right, #9ca3af, #6b7280)"
                    : "linear-gradient(to right, #312e81, #4c1d95, #3b0764)",
                },
              }}
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
