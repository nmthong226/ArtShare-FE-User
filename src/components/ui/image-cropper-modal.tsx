import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getCroppedImg from "@/utils/cropImage";
import MuiButton from "@mui/material/Button";

interface Props {
  image: string;
  open: boolean;
  onClose: () => void;
  onCropped: (croppedFile: Blob) => void;
}

interface AspectOption {
  label: string;
  value: number | "free";
}

const aspectOptions: AspectOption[] = [
  { label: "1:1", value: 1 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
];

export const ImageCropperModal: React.FC<Props> = ({
  image,
  open,
  onClose,
  onCropped,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [selectedAspect, setSelectedAspect] = useState("Free");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const cropImage = async () => {
    if (croppedAreaPixels) {
      const cropped = await getCroppedImg(image, croppedAreaPixels);
      onCropped(cropped);
      onClose();
    }
  };

  const handleAspectChange = (option: AspectOption) => {
    setAspect(option.value === "free" ? undefined : option.value);
    setSelectedAspect(option.label);
  };

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const naturalAspect = img.width / img.height;
      setAspect(naturalAspect);
      setSelectedAspect("Original");
    };
  }, [image]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "50vw",
          maxWidth: "50vw",
          margin: "auto",
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h6">Crop Image</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        className="flex flex-col gap-4"
        sx={{
          padding: 0,
          maxHeight: "calc(100vh - 150px)",
          overflow: "auto",
        }}
      >
        <div
          className="w-full relative  overflow-hidden"
          style={{ height: 320, minHeight: 280 }}
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="text-sm px-6 pb-4 flex flex-col gap-3 dark:text-white">
          <div>
            <label>
              Zoom
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:text-white"
              />
            </label>
            <div className="flex justify-between text-xs mt-1">
              <span>1x</span>
              <span>{zoom.toFixed(1)}x</span>
              <span>3x</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {aspectOptions.map((option) => (
              <Button
                key={option.label}
                variant={
                  selectedAspect === option.label ? "default" : "outline"
                }
                onClick={() => handleAspectChange(option)}
                className="cursor-pointer"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <MuiButton
          variant="outlined"
          onClick={onClose}
          className="dark:text-white"
          sx={{
            border: "none",
            color: "#000", // black text
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#f3f4f6", // subtle gray background on hover (optional)
              border: "none",
            },
          }}
        >
          Cancel
        </MuiButton>

        <MuiButton variant="contained" onClick={cropImage}>
          Crop & Save
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
