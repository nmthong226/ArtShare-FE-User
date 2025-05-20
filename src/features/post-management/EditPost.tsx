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
import { fetchPost } from "../post/api/post.api";
import { updatePost } from "./api/update-post";
import UploadForm from "./components/UploadForm";
import MediaSelection from "./components/media-selection";
import { mappedCategoryPost } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Post } from "@/types";
import { MEDIA_TYPE } from "@/utils/constants";
import { Area } from "react-easy-crop";

const VIDEO_STORAGE_DIRECTORY = "posts";

interface ThumbnailMeta {
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  selectedAspect: string;
  croppedAreaPixels: Area;
  initialThumbnail: string;
}

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
  const [cate_ids, setCateIds] = useState<number[]>([]);

  const [lastCrop, setLastCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastZoom, setLastZoom] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>();
  const [thumbnailCropMeta, setThumbnailCropMeta] = useState<string>("{}");
  const [thumbnailMeta, setThumbnailMeta] = useState<ThumbnailMeta | undefined>(
    undefined,
  );

  const getThumbnailCropMeta = () => {
    const cropMeta = JSON.parse(thumbnailCropMeta);
    return {
      crop: cropMeta.crop,
      zoom: cropMeta.zoom,
      aspect: cropMeta.aspect,
      selectedAspect: cropMeta.selectedAspect,
      croppedAreaPixels: cropMeta.croppedAreaPixels,
      initialThumbnail: cropMeta.initialThumbnail,
    };
  };

  useEffect(() => {
    if (isPostLoading || postError) return;
    setThumbnailCropMeta(JSON.stringify(postData?.thumbnail_crop_meta) ?? "{}");
  }, [postData]);

  const fetchFileFromUrl = async (
    url: string,
    fileName: string,
  ): Promise<File> => {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/octet-stream", // Ensure the correct content type
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      throw new Error("The fetched resource is not an image.");
    }

    return new File([blob], fileName, { type: blob.type });
  };

  useEffect(() => {
    if (isPostLoading || postError) return;
    if (Object.keys(getThumbnailCropMeta()).length === 0) return;
    const metaData = getThumbnailCropMeta();
    setThumbnailMeta(metaData);

    fetchFileFromUrl(metaData.initialThumbnail, "initial_thumbnail").then(
      (file) => {
        setLastCrop(metaData?.crop);
        setLastZoom(metaData?.zoom);
        setOriginalThumbnailFile(file);
      },
    );
  }, [thumbnailCropMeta]);

  /** ─────────────────── preload fetched post into state ─────────────────── */
  useEffect(() => {
    if (!postData) return;

    // Populate form state
    setTitle(postData.title);
    setDescription(postData.description ?? "");
    setIsMature(postData.is_mature);
    setAiCreated(postData.ai_created);
    setCateIds(postData?.categories?.map((c) => c.id) ?? []);

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
    // TODO: uncomment this
    // data: typeof postData,
    videoUrl?: string,
    initialThumbnail?: string,
    thumbnailUrl?: string,
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    // TODO: uncomment this
    formData.append("cate_ids", JSON.stringify(cate_ids));
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
    formData.append(
      "thumbnail_crop_meta",
      JSON.stringify({
        ...JSON.parse(thumbnailCropMeta),
        initialThumbnail: initialThumbnail,
      }),
    );
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
      const [videoUrl, initialThumbnail, thumbnailUrl] = await Promise.all([
        handleUploadVideo(),
        handleUploadInitialThumbnail(),
        handleUploadThumbnail(),
      ]);
      // TODO: uncomment this
      // const body = createFormData(postData, videoUrl, thumbnailUrl);
      const body = createFormData(videoUrl, initialThumbnail, thumbnailUrl);

      for (const [key, value] of body.entries()) {
        // Note: value could be a File or a string
        console.log(key, value);
      }
      await updatePost(parseInt(postId!), body);
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
      <Box className="flex justify-center items-center space-x-4 h-full">
        <CircularProgress size={36} />
        <p>Loading...</p>
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
        className="flex gap-3 p-4 w-full h-[calc(100vh-4rem)]"
        style={{ overflow: "hidden" }}
      >
        {/* LEFT: Media selection */}
        <MediaSelection
          setImageFiles={setImageFiles}
          imageFiles={imageFiles}
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
              onThumbnailChange={(f, _, thumbnail_crop_meta = "{}") => {
                setThumbnailFile(f);
                setThumbnailCropMeta(thumbnail_crop_meta);
              }}
              setOriginalThumbnailFile={setOriginalThumbnailFile}
              originalThumbnailFile={originalThumbnailFile}
              isSubmitted={isSubmitted}
              title={title}
              cate_ids={cate_ids}
              setCateIds={setCateIds}
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
              initialAspect={thumbnailMeta?.aspect}
              initialSelectedAspect={thumbnailMeta?.selectedAspect}
              initialCroppedAreaPixels={thumbnailMeta?.croppedAreaPixels}
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
