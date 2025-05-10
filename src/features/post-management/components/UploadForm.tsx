import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  FormHelperText,
  FormControl,
  Tooltip,
} from "@mui/material";
import SubjectSelector from "./SubjectSelector";
import { MdCrop, MdErrorOutline, MdPhotoCameraBack } from "react-icons/md";

import { ImageUpIcon } from "lucide-react";
import { ImageCropperModal } from "@/components/ui/image-cropper-modal";
import { Area } from "react-easy-crop";

const UploadForm: React.FC<{
  thumbnailFile: File | undefined;
  onThumbnailChange: (
    file: File | undefined,
    isOriginal?: boolean,
    thumbnail_crop_meta?: string,
  ) => void;
  isSubmitted: boolean;
  cate_ids: number[];
  setCateIds: (value: number[]) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isMature: boolean;
  setIsMature: (value: boolean) => void;
  aiCreated: boolean;
  setAiCreated: (value: boolean) => void;
  originalThumbnailFile: File | undefined;
  setOriginalThumbnailFile: (file: File | undefined) => void;
  lastCrop: { x: number; y: number };
  lastZoom: number;
  setLastCrop: (value: { x: number; y: number }) => void;
  setLastZoom: (value: number) => void;
  existingThumbnailUrl?: string;
  initialAspect?: number;
  initialSelectedAspect?: string;
  initialCroppedAreaPixels?: Area;
  initialThumbnailImage?: string;
}> = ({
  thumbnailFile,
  setOriginalThumbnailFile,
  onThumbnailChange,
  isSubmitted,
  cate_ids,
  setCateIds,
  title,
  setTitle,
  description,
  setDescription,
  isMature,
  setIsMature,
  aiCreated,
  setAiCreated,
  originalThumbnailFile,
  lastCrop,
  lastZoom,
  setLastCrop,
  setLastZoom,
  existingThumbnailUrl,
  initialAspect,
  initialSelectedAspect,
  initialCroppedAreaPixels,
}) => {
  // const [description, setDescription] = useState("");
  const [thumbnailCropOpen, setThumbnailCropOpen] = useState(false);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!thumbnailCropOpen || !originalThumbnailFile) return;

    const url = URL.createObjectURL(originalThumbnailFile);
    setInitialThumbnailUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [thumbnailCropOpen, originalThumbnailFile]);

  return (
    <Box className="space-y-3 mx-auto w-full dark:text-white text-left">
      {/* Artwork Title Box */}
      <Box className="space-y-2 dark:bg-mountain-900 rounded-md">
        <Box className="p-3 border-mountain-300 dark:border-mountain-700 border-b">
          <Typography className="font-semibold dark:text-white text-base text-left">
            Title
          </Typography>
        </Box>

        <FormControl
          fullWidth
          error={isSubmitted && !title.trim()}
          className="space-y-1 px-3 py-3"
        >
          <TextField
            placeholder="What do you call your artwork"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={isSubmitted && !title.trim()}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
              },
            }}
            slotProps={{
              input: {
                className:
                  "text-base placeholder:text-mountain-950 bg-white dark:bg-mountain-950 dark:text-mountain-50",
              },
            }}
          />
          {isSubmitted && !title.trim() && (
            <FormHelperText>
              <MdErrorOutline
                size="1.5em"
                style={{
                  verticalAlign: "middle",
                  marginRight: "0.5em",
                  color: "red",
                }}
              />
              Title is required
            </FormHelperText>
          )}
        </FormControl>
      </Box>
      {/* Artwork Description Box */}
      <Box className="space-y-2 dark:bg-mountain-900 rounded-md">
        {/* Heading with bottom border */}
        <Box className="p-3 border-mountain-300 dark:border-mountain-700 border-b">
          <Typography className="font-semibold dark:text-white text-base text-left">
            Details
          </Typography>
        </Box>

        <Box className="space-y-1 px-3 pb-3">
          <Typography className="dark:text-mountain-200 text-base text-left">
            Description
          </Typography>
          <TextField
            placeholder="Describe your work"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              input: {
                className:
                  "p-3 text-base dark:placeholder:text-base dark:text-white dark:placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

        {/* Content / Mature Checkbox */}
        <Box className="px-3 pb-3">
          <Typography className="mb-1 dark:text-mountain-200 text-base text-left">
            Content
          </Typography>
          <FormControl component="fieldset" className="space-y-2 px-2">
            {/* Mature content checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMature}
                  onChange={(e) => setIsMature(e.target.checked)}
                  sx={{
                    color: "#6b7280",
                    "&.Mui-checked": { color: "#a5b4fc" },
                  }}
                />
              }
              label={
                <>
                  <span className="ml-2 dark:text-white">
                    Has mature content
                  </span>
                  <span className="dark:text-mountain-200">
                    {" "}
                    (see our{" "}
                    <a href="/mature-content" className="hover:underline">
                      guidelines
                    </a>
                    )
                  </span>
                </>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={aiCreated}
                  onChange={(e) => setAiCreated(e.target.checked)}
                  sx={{
                    color: "#6b7280",
                    "&.Mui-checked": { color: "#a5b4fc" },
                  }}
                />
              }
              label={
                <span className="ml-2 dark:text-white">Created with AI</span>
              }
            />
          </FormControl>
        </Box>
      </Box>
      {initialThumbnailUrl && (
        <ImageCropperModal
          image={initialThumbnailUrl}
          open={thumbnailCropOpen}
          onClose={() => setThumbnailCropOpen(false)}
          initialCrop={lastCrop}
          initialZoom={lastZoom}
          initialAspect={initialAspect}
          initialSelectedAspect={initialSelectedAspect}
          initialCroppedAreaPixels={initialCroppedAreaPixels}
          onCropChange={setLastCrop}
          onZoomChange={setLastZoom}
          onCropped={(blob, thumbnail_crop_meta) => {
            onThumbnailChange(
              new File([blob], "cropped_thumbnail.png", { type: "image/png" }),
              false,
              thumbnail_crop_meta,
            );
          }}
        />
      )}

      <Box className="space-y-2 px-3">
        <Typography className="dark:text-mountain-200 text-base text-left">
          Thumbnail
        </Typography>
        <Typography
          variant="body2"
          className="mb-1 text-gray-700 dark:text-mountain-400"
        >
          Set a thumbnail that stands out for your post.
        </Typography>
        <Box
          className={`flex flex-col justify-center items-center border ${
            thumbnailFile || existingThumbnailUrl
              ? "border-none"
              : "border-gray-500 border-dashed"
          } rounded min-h-32 overflow-hidden`}
          component="label"
        >
          {thumbnailFile ? (
            <img
              src={URL.createObjectURL(thumbnailFile)}
              alt="Thumbnail"
              className="max-h-64"
            />
          ) : existingThumbnailUrl ? (
            <img
              src={existingThumbnailUrl}
              alt="Existing Thumbnail"
              className="max-h-64"
            />
          ) : (
            <>
              <ImageUpIcon className="text-gray-400 text-4xl" />
              <Typography>Upload file</Typography>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onThumbnailChange(file, true); // ✅ original
              }
            }}
          />
        </Box>
        {(thumbnailFile || existingThumbnailUrl) && (
          <div className="flex gap-2">
            <Tooltip title="Crop">
              <IconButton
                onClick={() => setThumbnailCropOpen(true)}
                className="border border-gray-300 dark:border-white text-gray-900 dark:text-white"
              >
                <MdCrop />
              </IconButton>
            </Tooltip>

            <Tooltip title="Replace">
              <IconButton
                component="label"
                className="border border-gray-300 dark:border-white text-gray-900 dark:text-white"
              >
                <MdPhotoCameraBack />

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setOriginalThumbnailFile(file);
                      onThumbnailChange(file);
                      // ✅ Reset crop and zoom
                      setLastCrop({ x: 0, y: 0 });
                      setLastZoom(1);
                    }
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </Box>
      {/* Categorization Box */}
      <Box className="space-y-2 dark:bg-mountain-900 rounded-md">
        {/* Heading with bottom border */}
        <Box className="p-3 border-mountain-300 dark:border-mountain-700 border-b">
          <Typography className="font-semibold dark:text-white text-base text-left">
            Categorization
          </Typography>
        </Box>

        {/* Art type */}
        <Box className="flex flex-col space-y-1  pb-3 w-full">
          {/* Dialog for Selection */}
          <Box className="space-y-1 px-3 pb-3">
            {/** TODO: uncomment this */}
            <SubjectSelector setCateIds={setCateIds} cate_ids={cate_ids} />
          </Box>
        </Box>

        {/* Tags: Commented since we may need this in the future*/}
        {/* <Box className="space-y-1 px-3">
          <Typography className="dark:text-mountain-200 text-base text-left">
            Tags
          </Typography>
          <Typography variant="body2" className="mb-1 dark:text-mountain-500">
            Tags help provide more context about your artwork.{" "}
           
          </Typography>

          <FormControl fullWidth variant="outlined">
            <Box
              className="dark:bg-mountain-950 p-3"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "6px",
                px: 1,
                py: 1,
                minHeight: 48,
                border: "1px solid",
                borderColor: isChipInputFocused
                  ? "mountain.100"
                  : "mountain.400",
                borderRadius: "8px",
                transition: "border-color 0.2s ease-in-out",
                borderWidth: "2px",
              }}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDelete(tag)}
                  className="dark:bg-[#3a3a3a] dark:text-white text-base"
                />
              ))}
              <OutlinedInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsChipInputFocused(true)}
                onBlur={() => setIsChipInputFocused(false)}
                placeholder={tags.length === 0 ? "Add tag" : ""}
                sx={{
                  flex: 1,
                  minWidth: "80px",
                  backgroundColor: "transparent",
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  padding: 0,
                  "& input": {
                    padding: 0,
                  },
                }}
                size="small"
              />

              {tags.length > 0 && (
                <IconButton
                  size="small"
                  className="dark:text-[#ccc]"
                  onClick={() => {
                    navigator.clipboard.writeText(tags.join(", "));
                    alert("Tags copied to clipboard");
                  }}
                >
                  <ContentCopyOutlined fontSize="small" />
                </IconButton>
              )}

              {tags.length >= 2 && (
                <IconButton
                  size="small"
                  className="dark:text-[#ccc]"
                  onClick={() => setTags([])}
                >
                  <CloseOutlined fontSize="small" />
                </IconButton>
              )}
            </Box>
            <FormHelperText className="dark:text-mountain-500">
              Type a tag and press <strong>Enter</strong> to add it.
            </FormHelperText>
          </FormControl>
        </Box> */}
      </Box>
    </Box>
  );
};

export default UploadForm;
