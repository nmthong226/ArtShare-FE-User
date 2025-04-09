import { useState } from 'react';

export function useImageFilesHandler(
  imageFilesPreview: Map<File, string>,
  videoPreviewUrl: string | undefined,
  setImageFilesPreview: (map: Map<File, string>) => void,
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setThumbnailFile: (file: File | undefined) => void
) {
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
    if (!videoPreviewUrl && newImagePreviewMap.size > 0) {
      setThumbnailFile(filesArray[0]);
    }
  };

  const handleRemoveImagePreview = (preview: File) => {
    const newImagePreviewMap = new Map(imageFilesPreview);
    URL.revokeObjectURL(newImagePreviewMap.get(preview)!);
    newImagePreviewMap.delete(preview);
    setImageFilesPreview(newImagePreviewMap);

    setImageFiles((prevFiles: File[]) => prevFiles.filter((file) => file !== preview));

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