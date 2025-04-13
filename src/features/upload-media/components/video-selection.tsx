import { Box, Button, Typography } from "@mui/material";
import useVideoFileHandler from "../hooks/use-video";
import {
  CloudUpload as CloudUploadIcon,
  DeleteOutlineOutlined,
  ReplayOutlined,
} from "@mui/icons-material";
import React, { useRef } from "react";

export default function VideoSelection({
  imageFilesPreview,
  videoPreviewUrl,
  setVideoFile,
  setThumbnailFile,
  setVideoPreviewUrl,
  hidden,
}: {
  imageFilesPreview: Map<File, string>;
  videoPreviewUrl: string | undefined;
  setVideoFile: (file: File | undefined) => void;
  setThumbnailFile: (file: File | undefined, isOriginal?: boolean) => void;
  setVideoPreviewUrl: (url: string | undefined) => void;
  hidden: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { handleVideoFileChange, handleRemoveVideoPreview } =
    useVideoFileHandler(
      setVideoFile,
      setThumbnailFile,
      imageFilesPreview,
      videoPreviewUrl,
      setVideoPreviewUrl,
    );

  return (
    <Box
      className={`relative w-full h-full rounded-md flex flex-col ${
        videoPreviewUrl ? "" : "border border-gray-500 border-dashed"
      }`}
      hidden={hidden}
      sx={{
        aspectRatio: "9 / 16",
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
        <Box className="flex flex-col gap-2 w-full h-full">
          {/* Replace & Remove buttons */}
          <Box className="flex justify-end gap-2 px-2 pt-2">
            <Button
              variant="text"
              size="small"
              startIcon={<ReplayOutlined sx={{ fontSize: 18 }} />}
              onClick={() => inputRef.current?.click()}
              sx={{
                backgroundColor: "transparent",
                color: "white",
                borderRadius: "10px",
                border: "1px solid",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Replace video
            </Button>

            <Button
              variant="text"
              size="small"
              startIcon={<DeleteOutlineOutlined sx={{ fontSize: 18 }} />}
              onClick={handleRemoveVideoPreview}
              sx={{
                backgroundColor: "transparent",
                color: "white",
                borderRadius: "10px",
                border: "1px solid",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Remove video
            </Button>

            {/* Hidden input for replacing video */}
            <input
              type="file"
              ref={inputRef}
              hidden
              accept="video/*"
              onChange={handleVideoFileChange}
            />
          </Box>

          <Box
            className="relative w-full"
            sx={{ maxHeight: 500, minHeight: 300 }}
          >
            <video
              src={videoPreviewUrl}
              controls
              className="rounded w-full object-contain"
              style={{
                maxHeight: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
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
  );
}
