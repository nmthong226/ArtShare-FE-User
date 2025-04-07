import { useSnackbar } from '@/contexts/SnackbarProvider';

export default function useVideoFileHandler(
  setVideoFile: (file: File | undefined) => void,
  setThumbnailFile: (file: File | undefined) => void,
  imageFilesPreview: Map<File, string>,
  videoPreviewUrl: string | undefined,
  setVideoPreviewUrl: (url: string | undefined) => void,
) {
  const { showSnackbar } = useSnackbar();

  const captureThumbnail = (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext("2d")?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setThumbnailFile(new File([blob], "thumbnailFromVideo.png", { type: "image/png" }));
      } else {
        throw new Error("Failed to create blob from canvas");
      }
    }, "image/png");

  };

  const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

    const file = newFiles[0];
    setVideoFile(file)
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.crossOrigin = "anonymous";

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      if (imageFilesPreview.size === 0) {
        captureThumbnail(video);
      }
    };

    video.onerror = () => {
      showSnackbar("Invalid video file.", "error");
      URL.revokeObjectURL(url);
    };
  };

  const handleRemoveVideoPreview = () => {
    URL.revokeObjectURL(videoPreviewUrl!); // Revoke the object URL
    setVideoPreviewUrl(undefined);
    setVideoFile(undefined);
    if (imageFilesPreview.size === 0) {
      setThumbnailFile(undefined);
    }
  }

  return {
    videoPreviewUrl,
    handleVideoFileChange,
    handleRemoveVideoPreview
  };
}
