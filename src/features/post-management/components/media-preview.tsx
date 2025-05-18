import { MEDIA_TYPE } from "@/utils/constants";
import { Media,  } from "../types/media";
import { Box } from "@mui/material";

interface MediaPreviewProps {
  media: Media;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ media }) => {
  return (
    media.type === MEDIA_TYPE.IMAGE ? (
      <img
        src={media.url}
        alt="Preview"
        className="w-full object-cover aspect-video"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
    ) : (
      <Box
        className="relative w-full"
        sx={{ maxHeight: 500, minHeight: 300 }}
      >
        <video
          src={media.url}
          controls
          className="rounded w-full object-contain"
          style={{
            maxHeight: "100%",
            width: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
    )
  );
};

export default MediaPreview;