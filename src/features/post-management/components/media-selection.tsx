import { lazy, Suspense, useState } from "react";
import { Box } from "@mui/material";
import { IoVideocam } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import TabValue from "../enum/media-tab-value";
import MediaUploadTab from "./media-upload-tab";
import ImagesSelection from "./images-selection";
import { Media } from "@/types";

const VideoSelection = lazy(() => import("./video-selection"));

export default function MediaSelection({
  setVideoFile,
  setImageFiles,
  setThumbnailFile,
  initialMedias,
}: {
  setVideoFile: (file: File | undefined) => void;
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setThumbnailFile: (file: File | undefined, isOriginal?: boolean) => void;
  initialMedias?: Media[];
}) {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | undefined>(
    undefined,
  );
  const [imageFilesPreview, setImageFilesPreview] = useState<Map<File, string>>(
    new Map(),
  );
  const [tabValue, setTabValue] = useState<TabValue>(TabValue.UPLOAD_IMAGE);

  return (
    <Box className="flex flex-col items-start bg-mountain-100 dark:bg-mountain-900 px-6 py-3 rounded-md w-[60%] h-full text-gray-900 dark:text-white">
      <div className="flex gap-x-1 w-full h-14">
        <MediaUploadTab
          isActive={tabValue == TabValue.UPLOAD_IMAGE}
          onClick={() => setTabValue(TabValue.UPLOAD_IMAGE)}
          icon={<IoMdImage className="mr-0.5 w-5 h-5" />}
          label="Upload image"
          examples="( .png, .jpg, .jpeg, ... )"
        />
        <MediaUploadTab
          isActive={tabValue == TabValue.UPLOAD_VIDEO}
          onClick={() => setTabValue(TabValue.UPLOAD_VIDEO)}
          icon={<IoVideocam className="mr-2 w-5 h-5 text-sm" />}
          label="Upload video"
          examples="( .mp4, .avi, .mov, ... )"
        />
      </div>
      <hr className="mb-3 border-mountain-400 border-t-1 w-full" />
      <ImagesSelection
        imageFilesPreview={imageFilesPreview}
        videoPreviewUrl={videoPreviewUrl}
        setImageFilesPreview={setImageFilesPreview}
        setImageFiles={setImageFiles}
        setThumbnailFile={setThumbnailFile}
        hidden={tabValue !== TabValue.UPLOAD_IMAGE}
        initialMedias={initialMedias}
      />
      <Suspense fallback={<div>Loading video component...</div>}>
        <VideoSelection
          imageFilesPreview={imageFilesPreview}
          videoPreviewUrl={videoPreviewUrl}
          setVideoFile={setVideoFile}
          setThumbnailFile={setThumbnailFile}
          setVideoPreviewUrl={setVideoPreviewUrl}
          hidden={tabValue !== TabValue.UPLOAD_VIDEO}
          initialMedias={initialMedias}
        />
      </Suspense>
    </Box>
  );
}
