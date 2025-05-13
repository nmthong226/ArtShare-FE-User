// TODO: remove this unused file

import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { useImageFilesHandler } from "../hooks/use-image-files";
import { MdCloudUpload, MdAdd, MdClose } from "react-icons/md";
import { Media } from "@/types";
import { useEffect, useRef } from "react";
import { MEDIA_TYPE } from "@/constants";

const MAX_IMAGES = 5;

export default function ImagesSelection({
  imageFilesPreview,
  videoPreviewUrl,
  setImageFilesPreview,
  setImageFiles,
  setThumbnailFile,
  hidden,
  initialMedias,
  setExistingImageUrls,
}: {
  imageFilesPreview: Map<File, string>;
  videoPreviewUrl: string | undefined;
  setImageFilesPreview: (map: Map<File, string>) => void;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setThumbnailFile: (file: File | undefined, isOriginal?: boolean) => void;
  hidden: boolean;
  initialMedias?: Media[];
  setExistingImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const {
    selectedPreview,
    setSelectedPreview,
    handleImageFilesChange,
    handleRemoveImagePreview,
  } = useImageFilesHandler(
    imageFilesPreview,
    videoPreviewUrl,
    setImageFilesPreview,
    setImageFiles,
    setThumbnailFile,
    setExistingImageUrls,
  );
  const didInit = useRef(false);

  useEffect(() => {
    if (!initialMedias || didInit.current) return;

    const imageMedias = initialMedias.filter(
      (m) => m.media_type === MEDIA_TYPE.IMAGE,
    );
    console.log("imageMedias", imageMedias);
    if (imageMedias.length === 0) return;

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
    didInit.current = true;
  }, [
    initialMedias,
    imageFilesPreview,
    setImageFilesPreview,
    setImageFiles,
    setSelectedPreview,
  ]);

  return (
    <Box
      className="items-center w-full h-full text-gray-900 dark:text-white overflow-hidden flex flex-col"
      hidden={hidden}
    >
      {/* Top row (info + delete button) */}
      <Box
        className="flex justify-between items-center w-full mb-2"
        sx={{ flexShrink: 0 }}
      >
        <Typography className="text-gray-900 dark:text-mountain-200 text-base">
          {imageFilesPreview.size}/{MAX_IMAGES} images
        </Typography>
      </Box>

      {/* Main Preview Area */}
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
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
            }}
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
                } as React.ChangeEvent<HTMLInputElement>);
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
              <MdCloudUpload className="mr-1" size={20} />
              <Typography variant="body1" className="text-center">
                Upload your art
              </Typography>
            </Button>
            <Typography variant="body1" className="text-center">
              or drag and drop here
            </Typography>
          </Box>
        )}
      </Box>

      {/* Carousel (previews) */}
      <Box
        className="flex gap-2 custom-scrollbar pt-4"
        sx={{
          flexShrink: 0,
          overflowX: "auto",
        }}
      >
        {Array.from(imageFilesPreview.entries()).map(
          ([file, previewUrl], index) => (
            <Box
              key={index}
              className="relative border-1 rounded-md cursor-pointer bounce-item"
              sx={{
                borderColor:
                  selectedPreview === file ? "primary.main" : "transparent",
              }}
              onClick={() => {
                setSelectedPreview(file);
              }}
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
                className="-top-2 -right-2 absolute opacity-60 bg-gray-600 hover:bg-gray-400 group "
              >
                <MdClose
                  className="text-white text-sm group-hover:text-black"
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
}
