import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ReplayOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { IoVideocam } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import { MEDIA_TYPE } from "@/constants";
import TabValue from "../enum/media-tab-value";
import MediaUploadTab from "./media-upload-tab";
import { Media } from "@/types";
import AutoSizer from "react-virtualized-auto-sizer";

const MAX_IMAGES = 5;

interface MediaSelectorPanelProps {
  /* shared props ─────────────────── */
  setVideoFile: (file?: File) => void;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setThumbnailFile: (file?: File, isOriginal?: boolean) => void;

  /* edit-only props – now optional ── */
  setExistingImageUrls?: React.Dispatch<React.SetStateAction<string[]>>;
  setExistingVideoUrl?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  initialMedias?: Media[];
}

export default function MediaSelectorPanel({
  setVideoFile,
  setImageFiles,
  setThumbnailFile,
  setExistingImageUrls,
  initialMedias,
  setExistingVideoUrl,
}: MediaSelectorPanelProps) {
  const [tabValue, setTabValue] = useState<TabValue>(TabValue.UPLOAD_IMAGE);
  const [imageFilesPreview, setImageFilesPreview] = useState<Map<File, string>>(
    new Map(),
  );
  const [selectedPreview, setSelectedPreview] = useState<File | undefined>();
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | undefined>(
    undefined,
  );
  const didInit = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isVideoManuallyRemoved, setIsVideoManuallyRemoved] = useState(false);

  const captureThumbnailFromVideo = (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setThumbnailFile(
          new File([blob], "thumbnailFromVideo.png", { type: "image/png" }),
          true,
        );
      } else {
        console.error("Failed to create blob from canvas");
      }
    }, "image/png");
  };

  // Load existing media (edit mode)
  useEffect(() => {
    if (!initialMedias || didInit.current) return;

    // 🖼️ Handle image preload
    const imageMedias = initialMedias.filter(
      (m) => m.media_type === MEDIA_TYPE.IMAGE,
    );
    const previewMap = new Map<File, string>();
    const dummyFiles: File[] = [];

    imageMedias.forEach((media, index) => {
      const dummyFile = new File([""], `existing_image_${index}`, {
        type: "image/jpeg",
      });
      dummyFiles.push(dummyFile);
      previewMap.set(dummyFile, media.url);
    });

    setImageFilesPreview(previewMap);
    setImageFiles(dummyFiles);
    setSelectedPreview(dummyFiles[0]);
    setExistingImageUrls?.(imageMedias.map((m) => m.url));

    // 🎥 Handle video preload only if not manually removed
    if (!videoPreviewUrl && !isVideoManuallyRemoved) {
      const video = initialMedias.find(
        (m) => m.media_type === MEDIA_TYPE.VIDEO,
      );
      if (video) {
        setVideoPreviewUrl(video.url);
        const dummyVideo = new File([""], "existing_video.mp4", {
          type: "video/mp4",
        });
        setVideoFile(dummyVideo);
      }
    }

    didInit.current = true;
  }, [initialMedias, videoPreviewUrl, isVideoManuallyRemoved]);

  const handleImageFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    setImageFiles(filesArray);

    const newMap = new Map(imageFilesPreview);
    filesArray.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      newMap.set(file, previewUrl);
    });

    setImageFilesPreview(newMap);
    setSelectedPreview(filesArray[0]);

    if (!videoPreviewUrl && newMap.size > 0) {
      setThumbnailFile(filesArray[0], true);
    }
  };

  const handleRemoveImagePreview = (preview: File) => {
    const url = imageFilesPreview.get(preview);
    if (url && !url.startsWith("blob:")) {
      setExistingImageUrls?.((prev) => prev.filter((u) => u !== url));
    }

    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }

    const newMap = new Map(imageFilesPreview);
    newMap.delete(preview);
    setImageFilesPreview(newMap);
    setImageFiles((files) => files.filter((f) => f !== preview));

    if (selectedPreview === preview) {
      const next = newMap.keys().next().value as File | undefined;
      setSelectedPreview(next);
      if (next) setThumbnailFile(next, true);
    }

    if (newMap.size === 0 && !videoPreviewUrl) {
      setThumbnailFile(undefined, true);
    }
  };

  const handleVideoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreviewUrl(previewUrl);

    // auto-thumbnail logic
    if (imageFilesPreview.size === 0) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = previewUrl;
      video.crossOrigin = "anonymous";

      video.onloadeddata = () => {
        video.currentTime = 0; // Go to the first frame
      };

      video.onseeked = () => {
        captureThumbnailFromVideo(video);
      };

      video.onerror = () => {
        console.error("Invalid video file.");
        URL.revokeObjectURL(previewUrl);
      };
    }
  };

  const handleRemoveVideoPreview = () => {
    if (videoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(undefined);
    setVideoFile(undefined);
    setIsVideoManuallyRemoved(true);
    setExistingVideoUrl?.(""); // ✅ Reset existing video URL so it won’t get sent again

    if (imageFilesPreview.size === 0) {
      setThumbnailFile(undefined, true);
    }
  };

  return (
    <Box className="flex flex-col items-start bg-mountain-100 dark:bg-mountain-900 px-6 py-3 rounded-md w-[60%] h-full text-gray-900 dark:text-white">
      {/* Tabs */}
      <div className="flex gap-x-1 w-full mb-3">
        <MediaUploadTab
          isActive={tabValue === TabValue.UPLOAD_IMAGE}
          onClick={() => setTabValue(TabValue.UPLOAD_IMAGE)}
          icon={<IoMdImage className="mr-0.5 w-5 h-5" />}
          label="Upload image"
          examples="( .png, .jpg, .jpeg, ... )"
        />
        <MediaUploadTab
          isActive={tabValue === TabValue.UPLOAD_VIDEO}
          onClick={() => setTabValue(TabValue.UPLOAD_VIDEO)}
          icon={<IoVideocam className="mr-2 w-5 h-5 text-sm" />}
          label="Upload video"
          examples="( .mp4 ... )"
        />
      </div>
      <hr className="mb-2 border-mountain-400 border-t-1 w-full" />

      {/* Images Section */}
      {tabValue === TabValue.UPLOAD_IMAGE && (
        <AutoSizer>
          {({ height, width }) => {
            const adjustedHeight = Math.max(height - 61, 150);
            return (
              <Box
                sx={{
                  width,
                  height: adjustedHeight,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "hidden",
                  minHeight: 0,
                }}
              >
                <Box
                  className="flex justify-between items-center w-full mb-2"
                  sx={{ flexShrink: 0 }}
                >
                  <Typography className="text-gray-900 dark:text-mountain-200 text-base">
                    {imageFilesPreview.size}/{MAX_IMAGES} images
                  </Typography>
                </Box>

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
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
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
                          } as ChangeEvent<HTMLInputElement>);
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
                        <Typography variant="body1">Upload your art</Typography>
                      </Button>
                      <Typography variant="body1">
                        or drag and drop here
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Carousel */}
                <Box
                  className="flex gap-2 custom-scrollbar pt-4"
                  sx={{ flexShrink: 0, overflowX: "auto" }}
                >
                  {Array.from(imageFilesPreview.entries()).map(
                    ([file, previewUrl], i) => (
                      <Box
                        key={i}
                        className="relative border-1 rounded-md cursor-pointer bounce-item"
                        sx={{
                          borderColor:
                            selectedPreview === file
                              ? "primary.main"
                              : "transparent",
                        }}
                        onClick={() => setSelectedPreview(file)}
                      >
                        <Avatar
                          src={previewUrl}
                          className="rounded-md"
                          sx={{ width: 80, height: 80 }}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImagePreview(file);
                          }}
                          size="small"
                          className="-top-2 -right-2 absolute opacity-60 bg-gray-600 hover:bg-gray-400 group"
                        >
                          <CloseIcon className="text-white text-sm group-hover:text-black" />
                        </IconButton>
                      </Box>
                    ),
                  )}

                  <Box
                    className="flex justify-center items-center border border-mountain-600 rounded-md w-[80px] h-[80px] text-gray-900 dark:text-white cursor-pointer"
                    component="label"
                    hidden={
                      imageFilesPreview.size === 0 ||
                      imageFilesPreview.size === MAX_IMAGES
                    }
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
            );
          }}
        </AutoSizer>
      )}

      {/* Video Section */}
      {tabValue === TabValue.UPLOAD_VIDEO && (
        <Box
          className={`relative w-full h-full rounded-md flex flex-col ${
            videoPreviewUrl ? "" : "border border-gray-500 border-dashed"
          }`}
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
              } as ChangeEvent<HTMLInputElement>);
            }
          }}
        >
          {videoPreviewUrl ? (
            <Box className="flex flex-col gap-4 w-full h-full">
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
                  onClick={() => handleRemoveVideoPreview()}
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
              <Typography
                variant="caption"
                sx={{
                  fontStyle: "italic",
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                * Our video upload only allows max 1 minute in length.
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
