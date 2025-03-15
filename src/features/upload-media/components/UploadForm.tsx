import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

interface UploadFormProps {
  files: FileList | null; // Receive files from parent if needed
}

const UploadForm: React.FC<UploadFormProps> = ({ files }) => {
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    // You can send `files` along with the rest of the form data
    const formData = {
      title,
      description,
      isMature,
      category,
      tags,
      files,
    };
    console.log("Form data:", formData);

    // Send formData to your backend or API here
  };

  return (
    <Box>
      <Typography variant="h6" className="mb-6">
        Artwork Details
      </Typography>

      {/* Artwork Title */}
      <TextField
        label="Artwork Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      {/* Artwork Description */}
      <TextField
        label="Artwork Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />

      {/* Mature Content Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isMature}
            onChange={(e) => setIsMature(e.target.checked)}
          />
        }
        label="Mark as Mature Content"
        className="mb-4"
      />

      {/* Category Selector */}
      <FormControl fullWidth className="mb-4">
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value as string)}
        >
          <MenuItem value="digital">Digital</MenuItem>
          <MenuItem value="traditional">Traditional</MenuItem>
          <MenuItem value="sculpture">Sculpture</MenuItem>
        </Select>
      </FormControl>

      {/* Tags */}
      <TextField
        label="Tags (comma separated)"
        variant="outlined"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="mb-6"
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadForm;
