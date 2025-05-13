// TODO: remove this unused file

import { useState } from "react";

export function useImageFilesHandler(
  imageFilesPreview: Map<File, string>,
  videoPreviewUrl: string | undefined,
  setImageFilesPreview: (map: Map<File, string>) => void,
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setThumbnailFile: (file: File | undefined, isOriginal?: boolean) => void,
  setExistingImageUrls: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const [selectedPreview, setSelectedPreview] = useState<File | undefined>(
    undefined,
  );

  const handleImageFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    setImageFiles(filesArray);

    const newImagePreviewMap = new Map(imageFilesPreview);
    filesArray.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      newImagePreviewMap.set(file, previewUrl);
    });
    setImageFilesPreview(newImagePreviewMap);

    setSelectedPreview(filesArray[0]);
    if (!videoPreviewUrl && newImagePreviewMap.size > 0) {
      setThumbnailFile(filesArray[0], true);
    }
  };

  const handleRemoveImagePreview = (preview: File) => {
    // 💥 Remove from existingImageUrls if it wasn’t a blob URL
    const url = imageFilesPreview.get(preview);
    if (url && !url.startsWith("blob:")) {
      setExistingImageUrls((prev) => prev.filter((u) => u !== url));
    }

    // 🔄 Revoke object URL if needed
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }

    // 1️⃣ Remove from your Map
    const newMap = new Map(imageFilesPreview);
    newMap.delete(preview);
    setImageFilesPreview(newMap);

    // 2️⃣ Remove from your File[] state
    setImageFiles((files) => files.filter((f) => f !== preview));

    // 3️⃣ Adjust selected preview if needed
    if (selectedPreview === preview) {
      const next = newMap.keys().next().value as File | undefined;
      setSelectedPreview(next);
      if (next) setThumbnailFile(next, true);
    }

    // 4️⃣ If nothing’s left (and no video), clear the thumbnail
    if (newMap.size === 0 && !videoPreviewUrl) {
      setThumbnailFile(undefined, true);
    }
  };

  return {
    imageFilesPreview,
    selectedPreview,
    setSelectedPreview,
    handleImageFilesChange,
    handleRemoveImagePreview,
  };
}
