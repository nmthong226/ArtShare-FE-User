import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; 


// TODO: Define Art Types : Fetch from API
const artTypes = [
  {
    name: "Abstract",
    description: "Artwork that focuses on shapes, colors, and forms.",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  },
  {
    name: "Anatomy",
    description: "Anatomical studies of humans and animals.",
    images: [
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg",
    ],
  },
];

const UploadForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [tags, setTags] = useState("");

  return (
    <Box className="w-full mx-auto text-white text-left space-y-3">
      {/* Artwork Title Box */}
      <Box className=" bg-mountain-900 space-y-3">
        <Box className="border-b p-2.5 border-mountain-200">
          <Typography className="font-semibold text-base text-left text-white">
            Artwork Title
          </Typography>
        </Box>

        <Box className="px-2.5 pb-2.5">
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
              "& .MuiOutlinedInput-input": {
                padding: "10px",
              },
            }}
            slotProps={{
              input: {
                className:
                  "border-1 bg-mountain-950 text-base text-white placeholder:text-mountain-400",
              },
            }}
          />
        </Box>
      </Box>

      {/* Artwork Description Box */}
      <Box className="bg-mountain-900 rounded-md space-y-2">
        {/* Heading with bottom border */}
        <Box className="border-b p-2.5 border-mountain-200">
          <Typography className="font-semibold text-base text-left text-white">
            Artwork Details
          </Typography>
        </Box>

        <Box className="px-2.5 pb-2.5 space-y-1">
          <Typography className="text-base text-left text-mountain-200">
            Description
          </Typography>
          <TextField
            placeholder="Describe your artwork"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              input: {
                className:
                  "bg-mountain-950 border-1 text-base placeholder:text-base text-white placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

        {/* Content / Mature Checkbox */}
        <Box className="px-2.5 pb-2.5 space-y-1">
          <Typography className="text-base text-left text-mountain-200">
            Content
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isMature}
                onChange={(e) => setIsMature(e.target.checked)}
                className="text-white"
              />
            }
            label={
              <>
                <span className="text-white">Has mature content</span>
                <span className="text-mountain-200">
                  {" "}
                  (see our Guidelines for{" "}
                </span>
                <a
                  href="/mature-content"
                  className="hover:underline"
                >
                  Mature Content
                </a>
                <span className="text-mountain-200">)</span>
              </>
            }
            className="text-base text-left"
          />
        </Box>
      </Box>

      {/* Categorization Box */}
      <Box className="bg-mountain-900 rounded-md space-y-2">
        {/* Heading with bottom border */}
        <Box className="border-b p-2.5 border-mountain-200">
          <Typography className="font-semibold text-base text-left text-white">
            Categorization
          </Typography>
        </Box>

        {/* Tags */}
        <Box className="px-2.5 space-y-1">
          <Typography className="text-base text-left text-mountain-200">
            Tags
          </Typography>
          <TextField
            placeholder="E.g: NoAI, CreatedUsingAI"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            slotProps={{
              input: {
                className:
                  "bg-mountain-950 border-1 text-base placeholder:text-base text-white placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

     {/* Art type */}
     <Box className="px-2.5 space-y-1">
          <Typography className="text-base text-left text-mountain-200">
            How would you categorize this work? (Choose up to 3)
          </Typography>
          <Box
            className="relative flex items-center bg-mountain-950 text-white px-3 py-2 rounded-md cursor-pointer"
            onClick={handleOpen}
          >
            <SearchIcon className="text-gray-400 mr-2" />
            <Typography className="text-base text-gray-400">
              {selectedArtTypes.length > 0 ? selectedArtTypes.join(", ") : "Choose art type"}
            </Typography>
          </Box> */}

          {/* Dialog for Selection */}
          <SubjectSelector />
        </Box>
      </Box>
    </Box>
  );
};

export default UploadForm;
