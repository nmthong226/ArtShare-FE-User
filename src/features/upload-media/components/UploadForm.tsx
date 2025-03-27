import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
  OutlinedInput,
  FormHelperText,
  FormControl,
} from "@mui/material";
import SubjectSelector from "./SubjectSelector";
import { CloseOutlined, ContentCopyOutlined } from "@mui/icons-material";
import { ImageUpIcon } from "lucide-react";
// import SearchIcon from "@mui/icons-material/Search";
// import CloseIcon from "@mui/icons-material/Close";

// // TODO: Define Art Types : Fetch from API
// const artTypes = [
//   {
//     name: "Abstract",
//     description: "Artwork that focuses on shapes, colors, and forms.",
//     images: [
//       "https://example.com/image1.jpg",
//       "https://example.com/image2.jpg",
//     ],
//   },
//   {
//     name: "Anatomy",
//     description: "Anatomical studies of humans and animals.",
//     images: [
//       "https://example.com/image3.jpg",
//       "https://example.com/image4.jpg",
//     ],
//   },
// ];

const UploadForm: React.FC<{
  isImageUpload: boolean;
  thumbnail: string | null;
  onThumbnailChange: (url: string) => void;
  isSubmitted: boolean;
}> = ({ isImageUpload, thumbnail, onThumbnailChange, isSubmitted }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChipInputFocused, setIsChipInputFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags((prevTags) => [...prevTags, inputValue.trim()]);
      }
      setInputValue("");
    }

    // Handle Backspace when input is empty
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      setTags((prevTags) => prevTags.slice(0, -1));
    }
  };

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box className="w-full mx-auto dark:text-white text-left space-y-3">
      {/* Artwork Title Box */}
      <Box className=" dark:bg-mountain-900 space-y-3">
        <Box className="border-b p-2.5 dark:border-mountain-200">
          <Typography className="font-semibold text-base text-left dark:text-white">
            Title
          </Typography>
        </Box>

        <FormControl fullWidth error={isSubmitted && !title.trim()}>
          <TextField
            placeholder="What do you call your artwork"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
              },
            }}
            slotProps={{
              input: {
                className:
                  "text-base text-white dark:placeholder:text-mountain-400",
              },
            }}
          />
          {isSubmitted && !title.trim() && (
            <FormHelperText>Title is required</FormHelperText>
          )}
        </FormControl>
      </Box>

      {/* Artwork Description Box */}
      <Box className="dark:bg-mountain-900 rounded-md space-y-2">
        {/* Heading with bottom border */}
        <Box className="border-b p-2.5 dark:border-mountain-200">
          <Typography className="font-semibold text-base text-left dark:text-white">
            Details
          </Typography>
        </Box>

        <Box className="px-2.5 pb-2.5 space-y-1">
          <Typography className="text-base text-left dark:text-mountain-200">
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
                  "p-2.5  text-base dark:placeholder:text-base dark:text-white dark:placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

        {/* Content / Mature Checkbox */}
        <Box className="px-2.5 pb-2.5 space-y-1">
          <Typography className="text-base text-left dark:text-mountain-200">
            Content
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isMature}
                onChange={(e) => setIsMature(e.target.checked)}
                sx={{
                  color: "#6b7280",
                  "&.Mui-checked": {
                    color: "#a5b4fc",
                  },
                }}
              />
            }
            label={
              <>
                <span className="dark:text-white">Has mature content</span>
                <span className="dark:text-mountain-200">
                  {" "}
                  (see our Guidelines for{" "}
                </span>
                <a href="/mature-content" className="hover:underline">
                  Mature Content
                </a>
                <span className="dark:text-mountain-200">)</span>
              </>
            }
            className="text-base text-left"
          />
        </Box>
      </Box>

      {!isImageUpload && (
        <Box className="px-2.5 space-y-2">
          <Typography className="text-base text-left dark:text-mountain-200">
            Thumbnail
          </Typography>
          <Typography variant="body2" className="mb-1 dark:text-mountain-500">
            Set a thumbnail that stands out for your video.
          </Typography>
          <Box
            className="border border-dashed border-gray-500 rounded flex flex-col items-center justify-center h-32"
            component="label"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="h-full object-contain"
              />
            ) : (
              <>
                <ImageUpIcon className="text-4xl text-gray-400" />
                <Typography>Upload file</Typography>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onThumbnailChange(URL.createObjectURL(file));
              }}
            />
          </Box>
        </Box>
      )}

      {/* Categorization Box */}
      <Box className="dark:bg-mountain-900 rounded-md space-y-2">
        {/* Heading with bottom border */}
        <Box className="border-b p-2.5 dark:border-mountain-200">
          <Typography className="font-semibold text-base text-left dark:text-white">
            Categorization
          </Typography>
        </Box>

        {/* Tags */}
        <Box className="px-2.5 space-y-1">
          <Typography className="text-base text-left dark:text-mountain-200">
            Tags
          </Typography>
          <Typography variant="body2" className="mb-1 dark:text-mountain-500">
            Tags help provide more context about your artwork.{" "}
            {/* <a href="#" style={{ color: "#3b82f6" }}>
              Learn more
            </a> */}
          </Typography>

          {/* Chip input box */}
          <Box
            className="dark:bg-mountain-950 p-2.5"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px",
              px: 1,
              py: 1,
              minHeight: 48,
              border: "1px solid",
              borderColor: isChipInputFocused ? "mountain.100" : "mountain.400",
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
                className="text-base dark:bg-[#3a3a3a] dark:text-white"
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
                  border: "none", // optional: remove border if it's inside a styled box
                },
                padding: 0, // remove internal spacing
                "& input": {
                  padding: 0, // remove padding inside the input element
                },
              }}
              size="small"
            />

            {/* Right icons inside the box */}
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

          {/* Helper text below */}
          <Typography
            variant="body2"
            className=" dark:text-mountain-500 mt-0.5"
          >
            Type a tag and press <strong>Enter</strong> to add it.
          </Typography>
        </Box>

        {/* Art type */}
        <Box className="px-2.5 pb-2.5 space-y-1">
          {/* Dialog for Selection */}
          {isImageUpload && (
            <Box className="px-2.5 pb-2.5 space-y-1">
              <SubjectSelector />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadForm;
