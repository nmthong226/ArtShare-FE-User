import { Button, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import { RiImageCircleAiFill } from "react-icons/ri";
import { MediaPreviewContainer } from "./media-preview-container";

interface BrowseAiImagesProps {
  handleImageFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const BrowseAiImages: React.FC<BrowseAiImagesProps> = ({
  handleImageFilesChange,
}) => {
  return (
    <MediaPreviewContainer>
      <div className="flex flex-col">
        <Button
          variant="text"
          component="label"
          size="small"
          className="flex flex-col justify-center items-center bg-white hover:bg-mountain-50 shadow-md p-4 border-1 border-mountain-200 w-40"
          sx={{
            backgroundColor: "transparent",
            color: "white",
            borderRadius: "10px",
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
          <RiImageCircleAiFill className="mb-2 size-10 text-mountain-600" />
          <Typography variant="body1" className="text-sm">Browse My Stock</Typography>
        </Button>
        {/* <Typography variant="body1" className="mt-2">
          or drag and drop here
        </Typography> */}
      </div>
    </MediaPreviewContainer>
  );
}
export default BrowseAiImages;