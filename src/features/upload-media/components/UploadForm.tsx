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
import {
  CloseOutlined,
  ContentCopyOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
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
  title: string;
  setTitle: (value: string) => void;
}> = ({
  isImageUpload,
  thumbnail,
  onThumbnailChange,
  isSubmitted,
  title,
  setTitle,
}) => {
  const [description, setDescription] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChipInputFocused, setIsChipInputFocused] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (isSubmitted) {
      setTitleError(e.target.value.trim() === "");
    }
  };

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
    <Box className="space-y-3 mx-auto w-full dark:text-white text-left">
      {/* Artwork Title Box */}
      <Box className="space-y-2 dark:bg-mountain-900 rounded-md">
        <Box className="p-2.5 border-mountain-300 dark:border-mountain-700 border-b">
          <Typography className="font-semibold dark:text-white text-base text-left">
            Title
          </Typography>
        </Box>

        <FormControl
          fullWidth
          error={isSubmitted && !title.trim()}
          className="space-y-1 px-2.5 pb-2.5"
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
                  "text-base text-white dark:placeholder:text-mountain-400",
              },
            }}
          />
          {isSubmitted && !title.trim() && (
            <FormHelperText>
              <ErrorOutlineOutlined
                fontSize="small"
                sx={{
                  verticalAlign: "middle",
                  marginRight: "0.5em",
                  fontSize: "1.5em",
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
        <Box className="p-2.5 border-mountain-300 dark:border-mountain-700 border-b">
          <Typography className="font-semibold dark:text-white text-base text-left">
            Details
          </Typography>
        </Box>

        <Box className="space-y-1 px-2.5 pb-2.5">
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
                  "p-2.5 text-base dark:placeholder:text-base dark:text-white dark:placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

        {/* Content / Mature Checkbox */}
        <Box className="px-2.5 pb-2.5">
          <Typography className="dark:text-mountain-200 text-base text-left">
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
        <Box className="space-y-2 px-2.5">
          <Typography className="dark:text-mountain-200 text-base text-left">
            Thumbnail
          </Typography>
          <Typography variant="body2" className="mb-1 dark:text-mountain-500">
            Set a thumbnail that stands out for your video.
          </Typography>
          <Box
            className="flex flex-col justify-center items-center border border-gray-500 border-dashed rounded h-32"
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
                if (file) onThumbnailChange(URL.createObjectURL(file));
              }}
            />
          </Box>
        </Box>
      )}

      {/* Categorization Box */}
      <Box className="space-y-2 dark:bg-mountain-900 rounded-md">
        {/* Heading with bottom border */}
        <Box className="p-2.5 border-mountain-300 dark:border-mountain-700 border-b">
          <Typography className="font-semibold dark:text-white text-base text-left">
            Categorization
          </Typography>
        </Box>

        {/* Tags: Commented since we may need this in the future*/}
        {/* <Box className="space-y-1 px-2.5">
          <Typography className="dark:text-mountain-200 text-base text-left">
            Tags
          </Typography>
          <Typography variant="body2" className="mb-1 dark:text-mountain-500">
            Tags help provide more context about your artwork.{" "}
           
          </Typography>

          <FormControl fullWidth variant="outlined">
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

        {/* Art type */}
        <Box className="flex flex-col space-y-1  pb-2.5 w-full">
          {/* Dialog for Selection */}
          {isImageUpload && (
            <Box className="space-y-1 px-2.5 pb-2.5">
              <SubjectSelector />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadForm;
