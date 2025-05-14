import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { createPost } from "./api/create-post";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getPresignedUrl,
  GetPresignedUrlResponse,
  uploadFile,
} from "@/api/storage";
import { nanoid } from "nanoid";
import { useLocation, useNavigate } from "react-router-dom";
import MediaSelection from "./components/media-selection";
import { AiFillAndroid } from "react-icons/ai";
import { FaMagic } from "react-icons/fa";

const UploadPost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPrompt: PromptResult | undefined = location.state?.prompt;
  console.log(selectedPrompt);
  const { showSnackbar } = useSnackbar();
  const [lastCrop, setLastCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastZoom, setLastZoom] = useState(1);
  const [originalThumbnailFile, setOriginalThumbnailFile] = useState<
    File | undefined
  >();
  const [title, setTitle] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cate_ids, setCateIds] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(
    undefined,
  );
  const [thumbnailCropMeta, setThumbnailCropMeta] = useState<string>("{}");
  const [isLoading, setIsLoading] = useState(false);
  const [isMature, setIsMature] = useState(false);
  const [aiCreated, setAiCreated] = useState(false);

  const VIDEO_STORAGE_DIRECTORY = "posts";

  const [aiImages, setAIImages] = useState<PromptResult[]>([]);

  useEffect(() => {
    if (selectedPrompt) {
      setAIImages([selectedPrompt]);
    }
  }, [selectedPrompt]);

  const createFormData = (
    title: string,
    description?: string,
    imageFiles?: File[],
    videoUrl?: string,
    initialThumbnail?: string,
    thumbnailUrl?: string,
    isMature?: boolean,
    aiCreated?: boolean,
    cate_ids?: number[],
  ) => {
    const formData = new FormData();

    formData.append("title", title);
    if (description) formData.append("description", description);
    // TODO: delete this when we have backend for categories
    // formData.append("ids", JSON.stringify([]));
    if (videoUrl) formData.append("video_url", videoUrl);
    if (thumbnailUrl) formData.append("thumbnail_url", thumbnailUrl);
    if (imageFiles) {
      imageFiles.forEach((file) => formData.append("images", file));
    }
    formData.append("is_mature", String(isMature));
    formData.append("ai_created", String(aiCreated));
    formData.append("cate_ids", JSON.stringify(cate_ids));
    formData.append(
      "thumbnail_crop_meta",
      JSON.stringify({
        ...JSON.parse(thumbnailCropMeta),
        initialThumbnail: initialThumbnail,
      }),
    );
    console.log("formData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    return formData;
  };

  const validateVideoDuration = (
    file: File,
    maxDurationSec = 60,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const isValid = videoElement.duration <= maxDurationSec;
        resolve(isValid);
      };

      videoElement.onerror = () => {
        resolve(false);
      };

      videoElement.src = URL.createObjectURL(file);
    });
  };

  // Function to handle the form submission
  const handleSubmit = async () => {
    setIsSubmitted(true);

    // Validation for required fields
    if (!title.trim()) {
      showSnackbar("Title is required.", "error");
      return;
    }

    if ((!imageFiles || imageFiles.length === 0) && !videoFile) {
      showSnackbar("At least one image or video is required.", "error");
      return;
    }

    // ✅ Video length validation
    if (videoFile) {
      const isVideoValid = await validateVideoDuration(videoFile, 60); // 60 sec max
      if (!isVideoValid) {
        showSnackbar("Video length cannot exceed 1 minute.", "error");
        return;
      }
    }

    try {
      setIsLoading(true);

      if (!thumbnailFile) {
        throw new Error("Thumbnail file is not defined");
      }

      // Create promises to upload video and create post at the same time
      const uploadVideoPromise = handleUploadVideo();
      const uploadInitThumbnailPromise = handleUploadInitialThumbnail();
      const uploadThumbnailPromise = handleUploadThumbnail();

      // Use Promise.all with await to wait for both operations to complete
      const [videoUrl, initialThumbnail, thumbnailUrl] = await Promise.all([
        uploadVideoPromise,
        uploadInitThumbnailPromise,
        uploadThumbnailPromise,
      ]);

      await handleCreatePost(thumbnailUrl, initialThumbnail, videoUrl);

      navigate("/explore");
    } catch (error) {
      console.error("Error during submission:", error);
      showSnackbar("Failed to create post or upload video.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadVideo = async (): Promise<string | undefined> => {
    if (!videoFile) {
      return Promise.resolve(undefined);
    }

    try {
      const presignedUrlResponse: GetPresignedUrlResponse =
        await getPresignedUrl(
          `${videoFile.name.split(".")[0]}_${nanoid(6)}`,
          videoFile.type.split("/")[1],
          "video",
          VIDEO_STORAGE_DIRECTORY,
        );

      await uploadFile(videoFile, presignedUrlResponse.presignedUrl);

      console.log("Video uploaded successfully:", presignedUrlResponse.fileUrl);
      return presignedUrlResponse.fileUrl;
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      showSnackbar("Failed to get presigned URL.", "error");
      throw error; // Throw error to be caught in Promise.all
    }
  };

  const handleCreatePost = async (
    thumbnailUrl: string,
    initialThumbnail?: string,
    videoUrl?: string,
  ): Promise<void> => {
    const formData = createFormData(
      title,
      description,
      imageFiles,
      videoUrl,
      initialThumbnail,
      thumbnailUrl,
      isMature,
      aiCreated,
      cate_ids,
    );

    try {
      const response = await createPost(formData);
      console.log("Post created:", response);
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar("Failed to create post.", "error");
      throw error;
    }
  };

  const handleUploadThumbnail = async (): Promise<string> => {
    const thumbnailFileName = `thumbnail_${nanoid(6)}`;

    const presignedUrlResponse: GetPresignedUrlResponse = await getPresignedUrl(
      thumbnailFileName,
      thumbnailFile!.type.split("/")[1],
      "image",
      VIDEO_STORAGE_DIRECTORY,
    );

    await uploadFile(thumbnailFile!, presignedUrlResponse.presignedUrl);

    return presignedUrlResponse.fileUrl;
  };

  const handleUploadInitialThumbnail = async (): Promise<
    string | undefined
  > => {
    if (!originalThumbnailFile) return undefined;
    const presigned: GetPresignedUrlResponse = await getPresignedUrl(
      `initial_thumbnail_${nanoid(6)}`,
      originalThumbnailFile.type.split("/")[1],
      "image",
      VIDEO_STORAGE_DIRECTORY,
    );
    await uploadFile(originalThumbnailFile, presigned.presignedUrl);
    return presigned.fileUrl;
  };

  const handleThumbnailChange = (
    file: File | undefined,
    isOriginal = false,
    thumbnail_crop_meta = "{}",
  ) => {
    setThumbnailFile(file);
    setThumbnailCropMeta(thumbnail_crop_meta);

    if (isOriginal) {
      setOriginalThumbnailFile(file);
      setLastCrop({ x: 0, y: 0 });
      setLastZoom(1);
    }
  };

  const isMediaValid = (imageFiles?.length ?? 0) > 0 || videoFile;

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

      <Box
        className="flex gap-3 p-4 w-full h-[calc(100vh-4rem)]"
        style={{ overflow: "hidden" }}
      >
        {/* LEFT COLUMN */}
        <MediaSelection
          aiImages={aiImages}
          setAIImages={setAIImages}
          setImageFiles={setImageFiles}
          setVideoFile={setVideoFile}
          setThumbnailFile={handleThumbnailChange}
        />
        {/* RIGHT COLUMN: FORM FIELDS & ACTIONS */}
        <Box className="flex flex-col space-y-3 w-[40%]">
          {/* <Box className="mb-2">
            <UploadToggle
              isImageUpload={isImageUpload}
              onToggle={() => setIsImageUpload((prev) => !prev)}
            />
          </Box> */}
          {/* Form fields */}
          <Box className="relative pr-4 rounded-md w-full overflow-y-auto custom-scrollbar">
            <Tooltip title="Auto Generate Content (title, description, categories)" arrow placement="left">
              <div className="top-2 z-50 sticky flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md ml-auto rounded-full w-12 h-12 hover:scale-105 duration-300 ease-in-out hover:cursor-pointer transform">
                <FaMagic className="size-5 text-white" />
              </div>
            </Tooltip>
            <UploadForm
              thumbnailFile={thumbnailFile}
              setOriginalThumbnailFile={setOriginalThumbnailFile}
              onThumbnailChange={handleThumbnailChange}
              isSubmitted={isSubmitted}
              cate_ids={cate_ids}
              setCateIds={setCateIds}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              isMature={isMature}
              setIsMature={setIsMature}
              aiCreated={aiCreated}
              setAiCreated={setAiCreated}
              lastCrop={lastCrop}
              lastZoom={lastZoom}
              setLastCrop={setLastCrop}
              setLastZoom={setLastZoom}
              originalThumbnailFile={originalThumbnailFile}
            />
          </Box>
          <hr className="border-mountain-300 dark:border-mountain-700 border-t-1 w-full" />
          {/* Bottom actions */}
          <Box className="flex justify-between mt-auto pr-4 w-full">
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

export default UploadPost;