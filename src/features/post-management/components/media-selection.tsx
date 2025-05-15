import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Avatar, Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import {
  MdAdd,
  MdClose,
} from "react-icons/md";
import { MEDIA_TYPE } from "@/constants";
import TabValue from "../enum/media-tab-value";
import MediaUploadTab from "./media-upload-tab";
import { Media } from "@/types";
import AutoSizer from "react-virtualized-auto-sizer";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { RiFileVideoFill, RiImageCircleAiFill, RiImageCircleAiLine } from "react-icons/ri";
import { TbDeviceDesktop } from "react-icons/tb";
import { BsImageFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";

//Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LuImageOff } from "react-icons/lu";
import { IoSparkles } from "react-icons/io5";

const MAX_IMAGES = 4;
const MAX_VIDEO = 1;

interface MediaSelectorPanelProps {
  /* shared props ─────────────────── */
  setVideoFile: (file?: File) => void;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setThumbnailFile: (
    file?: File,
    isOriginal?: boolean,
    thumbnail_crop_meta?: string,
  ) => void;
  aiImages: PromptResult;
  setAIImages: React.Dispatch<React.SetStateAction<PromptResult | undefined>>;
  setMode: React.Dispatch<React.SetStateAction<'upload' | 'browse'>>;
  /* edit-only props – now optional ── */
  setExistingImageUrls?: React.Dispatch<React.SetStateAction<string[]>>;
  setExistingVideoUrl?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  initialMedias?: Media[];
}

const validateVideoDuration = (
  file: File,
  maxDurationSec = 60,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      resolve(videoElement.duration <= maxDurationSec);
    };
    videoElement.onerror = () => resolve(false);
    videoElement.src = URL.createObjectURL(file);
  });
};

export default function MediaSelectorPanel({
  setMode,
  aiImages,
  setAIImages,
  setVideoFile,
  setImageFiles,
  setThumbnailFile,
  setExistingImageUrls,
  initialMedias,
  setExistingVideoUrl,
}: MediaSelectorPanelProps) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [tabValue, setTabValue] = useState<TabValue>(TabValue.UPLOAD_MEDIA);
  const [pendingTab, setPendingTab] = useState<TabValue | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleTabChange = (newTab: TabValue) => {
    const hasAIImages = selectedAIImages?.image_urls.length! > 0;
    if (hasAIImages && newTab !== TabValue.BROWSE_GENAI) {
      setPendingTab(newTab);
      setConfirmDialogOpen(true);
      setMode('upload');
    } else {
      setTabValue(newTab);
      setMode('browse');
    }
  };
  useEffect(() => {
    if (type === "ai-gen") {
      setTabValue(TabValue.BROWSE_GENAI);
    } else if (type === "upload-device") {
      setTabValue(TabValue.UPLOAD_MEDIA);
    }
  }, [type]);

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
  const { showSnackbar } = useSnackbar();

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

  const handleVideoFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidDuration = await validateVideoDuration(file, 60);
    if (!isValidDuration) {
      showSnackbar("Video length cannot exceed 1 minute.", "error");
      return;
    }

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

  // -------------------------------------------------
  const [selectedAIImages, setSelectedAIImages] = useState<PromptResult>();
  const [previewAI, setPreviewAI] = useState<string>();

  useEffect(() => {
    if (aiImages && aiImages.image_urls.length > 0) {
      setSelectedAIImages(aiImages);
      setPreviewAI(aiImages.image_urls[0]);
    }
  }, [aiImages]);

  const handleRemoveAIPreview = () => {
    if (!selectedAIImages || !previewAI) return;

    const updatedUrls = selectedAIImages.image_urls.filter((img) => img !== previewAI);

    if (updatedUrls.length > 0) {
      setSelectedAIImages({ ...selectedAIImages, image_urls: updatedUrls });
      setPreviewAI(updatedUrls[0]);
    } else {
      setSelectedAIImages(undefined);
      setPreviewAI(undefined);
    }
  };


  return (
    <Box className="flex flex-col items-start dark:bg-mountain-900 rounded-md w-[60%] h-full text-gray-900 dark:text-white">
      {/* Tabs */}
      <div className="z-20 flex gap-x-1 bg-white mb-3 p-1.25 border border-mountain-200 rounded-full w-full">
        <MediaUploadTab
          isActive={tabValue === TabValue.UPLOAD_MEDIA}
          onClick={() => handleTabChange(TabValue.UPLOAD_MEDIA)}
          icon={<TbDeviceDesktop className="mr-0.5 w-5 h-5" />}
          label="Upload from Device"
          examples="(image, video)"
        />
        <MediaUploadTab
          isActive={tabValue === TabValue.BROWSE_GENAI}
          onClick={() => handleTabChange(TabValue.BROWSE_GENAI)}
          icon={<RiImageCircleAiLine className="mr-2 w-5 h-5 text-sm" />}
          label="Post My AI Images"
          examples=""
        />
      </div>
      {/* Device Section */}
      {tabValue === TabValue.UPLOAD_MEDIA && (
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
                  position: "relative"
                }}
              >
                <Box
                  className="top-2 left-2 z-50 absolute flex items-center space-x-2 mb-2 w-full"
                  sx={{ flexShrink: 0 }}
                >
                  <Typography className="text-gray-900 dark:text-mountain-200 text-base">
                    {imageFilesPreview.size}/{MAX_IMAGES} images,
                  </Typography>
                  <Typography className="text-gray-900 dark:text-mountain-200 text-base">
                    {videoPreviewUrl ? 1 : 0}/{MAX_VIDEO} video
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: "100%",
                    minHeight: 0,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                  className="flex flex-col justify-center items-center bg-mountain-100 border border-gray-500 border-dashed rounded-lg w-full h-full"
                >
                  {selectedPreview ? (
                    <img
                      src={imageFilesPreview.get(selectedPreview)}
                      alt="Preview"
                      className="w-full object-cover aspect-video"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  ) : (
                    <Box
                      className="flex flex-col justify-center items-center bg-mountain-100 border border-gray-500 border-dashed rounded-lg w-full h-full"
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
                      <div className="flex space-x-2">
                        <Button
                          variant="text"
                          component="label"
                          size="small"
                          className="flex flex-col justify-center items-center bg-white hover:bg-mountain-50 shadow-md p-4 border-1 border-mountain-200 w-40"
                          sx={{
                            backgroundColor: "transparent",
                            color: "white",
                            borderRadius: "10px",
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
                          <BsImageFill className="mb-2 size-10 text-mountain-600" />
                          <Typography variant="body1" className="text-sm">Upload Image</Typography>
                        </Button>
                        <Button
                          variant="text"
                          component="label"
                          size="small"
                          className="flex flex-col justify-center items-center bg-white hover:bg-mountain-50 shadow-md p-4 border-1 border-mountain-200 w-40"
                          sx={{
                            backgroundColor: "transparent",
                            color: "white",
                            borderRadius: "10px",
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
                          <RiFileVideoFill className="mb-2 size-10 text-mountain-600" />
                          <Typography variant="body1" className="text-sm">Upload Video</Typography>
                        </Button>
                      </div>
                      <Typography variant="body1" className="mt-2">
                        or drag and drop here
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/* Carousel */}
                <Box
                  className="flex space-x-2 pt-3 h-fit custom-scrollbar"
                  sx={{ flexShrink: 0, overflowX: "hidden" }}
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
                          className="group -top-2 -right-2 absolute bg-gray-600 hover:bg-gray-400 opacity-60"
                        >
                          <MdClose
                            className="text-white group-hover:text-black text-sm"
                            size={16}
                          />
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
                    <MdAdd size={32} />
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
      {/* AI Section */}
      {tabValue === TabValue.BROWSE_GENAI && (
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
                  position: "relative"
                }}
              >
                <Box
                  className="top-2 z-50 absolute flex justify-between items-center mb-2 px-4 w-full"
                  sx={{ flexShrink: 0 }}
                >
                  <Typography className="text-gray-900 dark:text-mountain-200 text-base">
                    {selectedAIImages?.image_urls.length || 0}/{MAX_IMAGES} images
                  </Typography>
                  <Tooltip title="Marked as an AI Post. Its prompt may appear in trending suggestions for others to reuse.">
                    <div className={`${selectedAIImages && selectedAIImages.image_urls.length > 0 ? '' : 'hidden'} hover:cursor-pointer text-base items-center space-x-2 flex px-4 py-1 bg-white shadow rounded-full`}>
                      <IoSparkles className="text-amber-300" />
                      <p>Generated by ArtNova</p>
                    </div>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    height: "100%",
                    minHeight: 0,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                  className="flex flex-col justify-center items-center bg-mountain-100 border border-gray-500 border-dashed rounded-lg w-full h-full"
                >
                  {previewAI ? (
                    <img
                      src={previewAI}
                      alt="Preview"
                      className="w-full object-cover aspect-video"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  ) : (
                    <Box
                      className="flex flex-col justify-center items-center bg-mountain-100 border border-gray-500 border-dashed rounded-lg w-full h-full"
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
                      <div className="flex flex-col">
                        <Button
                          variant="text"
                          component="label"
                          size="small"
                          className="flex flex-col justify-center items-center bg-white hover:bg-mountain-50 shadow-md p-4 border-1 border-mountain-200 w-40"
                          sx={{
                            backgroundColor: "transparent",
                            color: "white",
                            borderRadius: "10px",
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
                          <RiImageCircleAiFill className="mb-2 size-10 text-mountain-600" />
                          <Typography variant="body1" className="text-sm">Browse My Stock</Typography>
                        </Button>
                        <Typography variant="body1" className="mt-2">
                          or drag and drop here
                        </Typography>
                      </div>
                    </Box>
                  )}
                </Box>
                {/* Carousel */}
                <Box
                  className="flex space-x-2 pt-3 h-fit custom-scrollbar"
                  sx={{ flexShrink: 0, overflowX: "hidden" }}
                >
                  {selectedAIImages?.image_urls.map((url, i) => (
                    <Box
                      key={i}
                      className="relative border-1 rounded-md cursor-pointer bounce-item"
                      sx={{
                        borderColor:
                          previewAI === url ? "primary.main" : "transparent",
                      }}
                      onClick={() =>
                        setPreviewAI(url)
                      }
                    >
                      <Avatar
                        src={url}
                        className="rounded-md"
                        sx={{ width: 80, height: 80 }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAIPreview(); // You may want to pass the `url` if removing by URL
                        }}
                        size="small"
                        className="group -top-2 -right-2 absolute bg-gray-600 hover:bg-gray-400 opacity-60"
                      >
                        <MdClose
                          className="text-white group-hover:text-black text-sm"
                          size={16}
                        />
                      </IconButton>
                    </Box>
                  ))}
                  <Box
                    className="flex justify-center items-center border border-mountain-600 rounded-md w-[80px] h-[80px] text-gray-900 dark:text-white cursor-pointer"
                    component="label"
                    hidden={
                      imageFilesPreview.size === 0 ||
                      imageFilesPreview.size === MAX_IMAGES
                    }
                  >
                    <MdAdd size={32} />
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
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="flex flex-col w-108">
          <DialogHeader>
            <DialogTitle>Change Tab Confirmation</DialogTitle>
            <DialogDescription>
              Switch tabs, your changes will be removed. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center bg-mountain-100 py-6">
            <LuImageOff className="size-12 text-mountain-600" />
          </div>
          <DialogFooter>
            <Button className="bg-mountain-100 hover:bg-mountain-100/80" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-700/80 text-mountain-50"
              onClick={() => {
                setSelectedAIImages(undefined);
                setPreviewAI(undefined);
                setTabValue(pendingTab!);
                setConfirmDialogOpen(false);
              }}
            >
              Yes, discard and switch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
