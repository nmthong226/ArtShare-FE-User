import React from "react";
import { Box, Button } from "@mui/material";

export default function MediaUploadTab({
  isActive,
  onClick,
  icon,
  label,
  examples,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  examples?: string;
}) {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      className={`flex items-center justify-start px-3 border rounded-sm w-1/2 transition-all duration-300 ${
        isActive
          ? "bg-indigo-800 text-white"
          : "bg-gray-900 text-white font-medium opacity-50"
      }`}
      sx={{
        height: 40,
        borderColor: isActive ? "#4F46E5" : "#4B5563",
        borderRadius: "2px",
        textTransform: "none",
        "&:hover": {
          backgroundColor: isActive ? undefined : "#374151",
        },
      }}
    >
      {icon}
      <Box
        component="div"
        className={`text-mountain-300 text-sm flex-1 overflow-hidden w-full`}
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label + " " + examples}
      </Box>
    </Button>
  );
}
