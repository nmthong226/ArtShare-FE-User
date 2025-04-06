import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { IoVideocam } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";

import { useImageFilesHandler } from "../hooks/use-image-files";
import useVideoFileHandler from "../hooks/use-video";

const MAX_IMAGES = 5;

interface MediaSelectionProps {
  setVideoFile: (file: File | undefined) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  setThumbnailFile: (file: File | undefined) => void;
}
export default function MediaSelection({
  setVideoFile,
  imageFiles,
  setImageFiles,
  setThumbnailFile,
}: MediaSelectionProps) {
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | undefined>(undefined);

  const {
    imageFilesPreview,
    selectedPreview,
    setSelectedPreview,
    handleImageFilesChange,
    handleRemoveImagePreview,
  } = useImageFilesHandler(
    imageFiles,
    videoPreviewUrl,
    setImageFiles,
    setThumbnailFile
  )

  const {
    handleVideoFileChange,
    handleRemoveVideoPreview
  } = useVideoFileHandler(
    imageFiles,
    setVideoFile,
    setThumbnailFile,
    videoPreviewUrl,
    setVideoPreviewUrl
  )

  return (
    <Box className="flex flex-col items-start bg-mountain-100 dark:bg-mountain-900 px-6 py-3 rounded-md w-[60%] h-full text-gray-900 dark:text-white">
      <div className="flex gap-x-1 w-full h-14">
        <Button
          variant="text"
          size="small"
          onClick={() => setIsImageUpload(true)}
          className={`flex items-center justify-start px-2 border rounded-sm w-1/2 transition-all duration-300 ${isImageUpload
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
              className={`${isImageUpload ? "text-mountain-300" : "text-gray-600"
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
          className={`flex items-center justify-start px-2 border rounded-sm w-1/2 transition-all duration-300 ${!isImageUpload
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
              className={`${!isImageUpload ? "text-mountain-300" : "text-gray-600"
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
              {imageFiles.length}/{MAX_IMAGES} images
            </Typography>
            {selectedPreview && <Button
              variant="text"
              size="small"
              startIcon={<DeleteOutlineOutlined sx={{ fontSize: 18 }} />}
              onClick={() => handleRemoveImagePreview(selectedPreview)}
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
            }
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
            {selectedPreview ? (
              <img
                src={imageFilesPreview.get(selectedPreview)}
                alt="Preview"
                className="w-full object-contain"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
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
              </Box>
            )}
          </Box>

          {/* Carousel (previews) */}
          <Box
            className="flex gap-2 custom-scrollbar mt-2"
            sx={{
              flexShrink: 0,
              overflowX: "auto",
            }}
          >
            {Array.from(imageFilesPreview.entries()).map(([file, previewUrl], index) => (
              <Box
                key={index}
                className="relative border-1 rounded-md cursor-pointer"
                sx={{
                  borderColor:
                    selectedPreview === file
                      ? "primary.main"
                      : "transparent",
                }}
                onClick={() => {
                  setSelectedPreview(file);
                }}
              >
                <Avatar
                  src={previewUrl}
                  className="rounded-md"
                  sx={{ width: 80, height: 80 }}
                />
                {index !== 0 && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImagePreview(file);
                    }}
                    size="medium"
                    className="top-0 right-0 absolute bg-gray-600 hover:bg-gray-700 bg-opacity-30 text-gray-900 dark:text-white"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}

            <Box
              className="flex justify-center items-center border border-mountain-600 rounded-md w-[80px] h-[80px] text-gray-900 dark:text-white cursor-pointer"
              component="label"
              hidden={imageFiles.length === 0 || imageFiles.length === MAX_IMAGES}
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
          </Box>
        </Box>
      ) : (
        // -------- VIDEO UPLOAD FLOW --------
        <Box
          className={`relative w-full rounded-md flex flex-col ${videoPreviewUrl
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
          {videoPreviewUrl ? (
            <Box className="relative w-full h-full">
              {/* Video preview */}
              <video
                src={videoPreviewUrl}
                controls
                className="rounded w-full h-full object-contain"
                style={{
                  maxHeight: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />

              <Button
                variant="text"
                size="small"
                startIcon={<DeleteOutlineOutlined sx={{ fontSize: 18 }} />}
                onClick={() => handleRemoveVideoPreview()}
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
                Remove video
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
    </Box >
  );
};