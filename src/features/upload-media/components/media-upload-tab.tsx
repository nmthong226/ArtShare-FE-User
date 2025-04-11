import React from "react";
import { Button } from "@mui/material";

export default function MediaUploadTab({
  isActive,
  onClick,
  icon,
  label,
  examples
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  examples?: string;
}
) {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      className={`flex items-center justify-start text-gray-400 px-3 border rounded-sm w-1/2 transition-all duration-300 ${isActive
        ? "bg-indigo-800"
        : "bg-gray-900 opacity-50"
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
      <div className={`${isActive && "text-mountain-50"}`}>{icon}</div>
      <span className={`${isActive && "text-mountain-50"} mr-2`}>{label}</span>{examples}
    </Button>
  );
}