import { useState } from 'react';

export function useImageFilesHandler(
  imageFiles: File[],
  videoPreviewUrl: string | undefined,
  setImageFiles: (files: File[]) => void,
  setThumbnailFile: (file: File | undefined) => void
) {
  const [imageFilesPreview, setImageFilesPreview] = useState<Map<File, string>>(new Map());
  const [selectedPreview, setSelectedPreview] = useState<File | undefined>(undefined);

  const handleImageFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (newImagePreviewMap.size > 0) {
      setThumbnailFile(filesArray[0]);
    }
  };

  const handleRemoveImagePreview = (preview: File) => {
    const newImagePreviewMap = new Map(imageFilesPreview);
    URL.revokeObjectURL(newImagePreviewMap.get(preview)!);
    newImagePreviewMap.delete(preview);
    setImageFilesPreview(newImagePreviewMap);

    setImageFiles(imageFiles.filter((file: File) => file !== preview));


    if (newImagePreviewMap.size === 0 && !videoPreviewUrl) {
      setThumbnailFile(undefined);
    }

    if (selectedPreview === preview) {
      setSelectedPreview(undefined);
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