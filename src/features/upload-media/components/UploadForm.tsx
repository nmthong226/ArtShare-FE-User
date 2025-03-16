import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

interface UploadFormProps {
  files: FileList | null;
}

const mediumOptions = [
  "Digital 2D",
  "Digital 3D",
  "Animation",
  "Traditional Paint",
  "AI Generation",
  "Traditional Ink",
  "Traditional Sculpture",
];

const UploadForm: React.FC<UploadFormProps> = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [tags, setTags] = useState("");
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);

  const handleMediumChange = (medium: string) => {
    setSelectedMediums((prev) =>
      prev.includes(medium)
        ? prev.filter((m) => m !== medium)
        : [...prev, medium]
    );
  };

  return (
    <Box className="w-full mx-auto  text-white text-left space-y-3">
      {/* Artwork Title Box */}
      <Box className=" bg-mountain-900  space-y-3">
        <Box className="border-b p-2.5 border-mountain-200 ">
          <Typography className="font-semibold text-sm text-left text-white">
            Artwork Title
          </Typography>
        </Box>

        {/* TextField with radius 5px */}
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
                  "border-1 bg-mountain-950 text-sm text-white placeholder:text-mountain-400",
              },
            }}
          />
        </Box>
      </Box>

      {/* Artwork Description Box */}
      <Box className="bg-mountain-900 rounded-md space-y-2">
        {/* Heading with bottom border */}
        <Box className="border-b p-2.5 border-mountain-200">
          <Typography className="font-semibold text-sm text-left text-white">
            Artwork Details
          </Typography>
        </Box>

        <Box className="px-2.5 pb-2.5 space-y-1">
          <Typography className="text-sm text-left text-mountain-200">
            Description
          </Typography>
          <TextField
            placeholder="Describe your art work"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              input: {
                className:
                  "bg-mountain-950 border-1  text-sm placeholder:text-sm text-white placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

        {/* Content / Mature Checkbox */}
        <Box className="px-2.5 pb-2.5 space-y-1">
          <Typography className="text-sm text-left text-mountain-200">
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
                  className="text-violet-600 hover:underline"
                >
                  Mature Content
                </a>
                <span className="text-mountain-200">)</span>
              </>
            }
            className="text-sm text-left"
          />
        </Box>
      </Box>

      {/* Categorization Box */}
      <Box className="bg-mountain-900 rounded-md space-y-2">
        {/* Heading with bottom border */}
        <Box className="border-b p-2.5 border-mountain-200">
          <Typography className="font-semibold text-sm text-left text-white">
            Categorization
          </Typography>
        </Box>

        {/* Tags */}
        <Box className="px-2.5 space-y-1">
          <Typography className="text-sm text-left text-mountain-200">
            Tags
          </Typography>
          <TextField
            placeholder="Type your artwork tags"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            slotProps={{
              input: {
                className:
                  "bg-mountain-950 border-1 text-sm placeholder:text-sm text-white placeholder:text-mountain-400 text-left",
              },
            }}
          />
        </Box>

        {/* Medium Checkboxes */}
        <Box className="px-2.5 space-y-1">
          <Typography className="text-sm text-left text-mountain-200">
            Medium
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {mediumOptions.map((medium) => (
              <FormControlLabel
                key={medium}
                control={
                  <Checkbox
                    checked={selectedMediums.includes(medium)}
                    onChange={() => handleMediumChange(medium)}
                    className="text-white "
                  />
                }
                label={medium}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadForm;
