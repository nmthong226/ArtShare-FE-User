import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  getPresignedUrl,
  GetPresignedUrlResponse,
  uploadFile,
} from "@/api/storage";
import { fetchPost } from "@/components/post/api/get-post";
import { updatePost } from "./api/update-post";
import UploadForm from "./components/UploadForm";
import MediaSelection from "./components/media-selection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { mappedCategoryPost } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Category, Post } from "@/types";
import { MEDIA_TYPE } from "@/constants";

const VIDEO_STORAGE_DIRECTORY = "posts";

/**
 * EditPostPage – fully‑screen page that reuses UploadPost components
 * Route: /posts/:postId/edit
 */
const EditPost: React.FC = () => {
  /** ──────────────────── fetch post data ─────────────────── */
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const passedPostData = location.state?.postData as Post | undefined;
  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["postData", postId],
    enabled: !!postId,
    queryFn: async () => {
      if (passedPostData) return passedPostData;
      const res = await fetchPost(parseInt(postId!));
      return mappedCategoryPost(res.data);
    },
    initialData: passedPostData,
  });

  /** ─────────────────── internal UI state (mirrors UploadPost) ─────────────────── */
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | undefined>();
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [originalThumbnailFile, setOriginalThumbnailFile] = useState<
    File | undefined
  >();
  const [isMature, setIsMature] = useState(false);
  const [aiCreated, setAiCreated] = useState(false);

  const [lastCrop, setLastCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastZoom, setLastZoom] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>();

  /** ─────────────────── preload fetched post into state ─────────────────── */
  useEffect(() => {
    if (!postData) return;

    // Populate form state
    setTitle(postData.title);
    setDescription(postData.description ?? "");
    setIsMature(postData.is_mature);
    setAiCreated(postData.ai_created);

    // 🟣 Extract only image URLs to preserve
    const existingImages = postData.medias.filter(
      (m) => m.media_type === MEDIA_TYPE.IMAGE,
    );
    setExistingImageUrls(existingImages.map((img) => img.url));

    // 🟣 grab existing video
    const ev = postData.medias.find((m) => m.media_type === MEDIA_TYPE.VIDEO);
    if (ev) {
      setExistingVideoUrl(ev.url);
      // create a dummy File so handleUploadVideo can detect “existing”
      setVideoFile(new File([], "existing_video.mp4", { type: "video/mp4" }));
    }
  }, [postData]);

  /** ─────────────────── helpers ─────────────────── */
  const createFormData = (
    data: typeof postData,
    videoUrl?: string,
    thumbnailUrl?: string,
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    formData.append(
      "cate_ids",
      JSON.stringify(data!.categories.map((cat: Category) => cat.id)),
    );
    const finalVideoUrl = videoUrl ?? existingVideoUrl;
    formData.append("video_url", finalVideoUrl ?? "");

    if (thumbnailUrl) formData.append("thumbnail_url", thumbnailUrl);
    imageFiles
      .filter((file) => file.size > 0) // ⛔️ exclude dummy
      .forEach((file) => formData.append("images", file));

    if (existingImageUrls.length > 0) {
      formData.append("existing_image_urls", JSON.stringify(existingImageUrls));
    }

    formData.append("is_mature", String(isMature));
    formData.append("ai_created", String(aiCreated));
    return formData;
  };

  const handleUploadVideo = async (): Promise<string | undefined> => {
    if (!videoFile) return undefined;

    if (videoFile.name.startsWith("existing_video")) {
      return postData?.medias.find((m) => m.media_type === "VIDEO")?.url;
    }

    const presigned: GetPresignedUrlResponse = await getPresignedUrl(
      `${videoFile.name.split(".")[0]}_${nanoid(6)}`,
      videoFile.type.split("/")[1],
      "video",
      VIDEO_STORAGE_DIRECTORY,
    );
    await uploadFile(videoFile, presigned.presignedUrl);
    return presigned.fileUrl;
  };

  const handleUploadThumbnail = async (): Promise<string | undefined> => {
    if (!thumbnailFile) return undefined;
    const presigned: GetPresignedUrlResponse = await getPresignedUrl(
      `thumbnail_${nanoid(6)}`,
      thumbnailFile.type.split("/")[1],
      "image",
      VIDEO_STORAGE_DIRECTORY,
    );
    await uploadFile(thumbnailFile, presigned.presignedUrl);
    return presigned.fileUrl;
  };

  /** ─────────────────── submit ─────────────────── */
  const handleSubmit = async () => {
    if (!postData) return;
    setIsSubmitted(true);

    if (!title.trim()) {
      showSnackbar("Title is required.", "error");
      return;
    }
    if (imageFiles.length === 0 && !videoFile) {
      showSnackbar("At least one image or video is required.", "error");
      return;
    }

    try {
      setIsUploading(true);
      const [videoUrl, thumbnailUrl] = await Promise.all([
        handleUploadVideo(),
        handleUploadThumbnail(),
      ]);
      const body = createFormData(postData, videoUrl, thumbnailUrl);
      for (const [key, value] of body.entries()) {
        // Note: value could be a File or a string
        console.log(key, value);
      }
      await updatePost(parseInt(postId!), body);
      showSnackbar("Post updated successfully", "success");
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update post", "error");
    } finally {
      setIsUploading(false);
    }
  };

  /** ─────────────────── render ─────────────────── */
  if (isPostLoading) {
    console.log({ postData, isPostLoading, postError });

    return (
      <Box className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </Box>
    );
  }
  if (postError || !postData) return <div>Unable to load post.</div>;

  const isMediaValid =
    imageFiles.length > 0 || videoFile || postData.medias.length > 0;

  return (
    <Box className="dark:bg-mountain-950 w-full h-full">
      {isUploading && (
        <Backdrop
          open
          sx={{ color: "#fff", zIndex: (t) => t.zIndex.modal + 1 }}
        >
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Updating post…</Typography>
        </Backdrop>
      )}

      {/* Body */}
      <Box
        className="flex gap-3 p-4 w-full h-[calc(100vh-4rem-56px)]"
        style={{ overflow: "hidden" }}
      >
        {/* LEFT: Media selection */}
        <MediaSelection
          setImageFiles={setImageFiles}
          setVideoFile={setVideoFile}
          setThumbnailFile={(f) => setThumbnailFile(f)}
          initialMedias={postData.medias}
          setExistingImageUrls={setExistingImageUrls}
          setExistingVideoUrl={setExistingVideoUrl}
        />

        {/* RIGHT: form */}
        <Box className="flex flex-col space-y-3 w-[50%]">
          <Box className="pr-4 rounded-md overflow-y-auto custom-scrollbar">
            <UploadForm
              thumbnailFile={thumbnailFile}
              onThumbnailChange={(f) => setThumbnailFile(f)}
              setOriginalThumbnailFile={setOriginalThumbnailFile}
              originalThumbnailFile={originalThumbnailFile}
              isSubmitted={isSubmitted}
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
              existingThumbnailUrl={postData.thumbnail_url}
            />
          </Box>
          <hr className="border-mountain-300 dark:border-mountain-700 border-t-1 w-full" />
          <Box className="flex justify-between mt-auto pr-4 w-full">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isMediaValid}
              className="ml-auto rounded-md"
              sx={{
                textTransform: "none",
                background: !isMediaValid
                  ? "linear-gradient(to right, #9ca3af, #6b7280)"
                  : "linear-gradient(to right, #3730a3, #5b21b6, #4c1d95)",
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
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditPost;
