import React from "react";
import { Button } from "@mui/material";

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
          : "bg-gray-900 text-white opacity-50"
      }`}
      sx={{
        height: 40,
        borderColor: isActive ? "#4F46E5" : "#4B5563",
        borderRadius: "2px",
        textTransform: "none",
        overflow: "hidden", // MUI style fallback
      }}
    >
      <div className={`${isActive && "text-mountain-50"} mr-2`}>{icon}</div>

      {/* ✅ Label + examples inline with truncation */}
      <div className="flex-1 text-sm font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="mr-1">{label}</span>
        <span className="text-gray-400">{examples}</span>
      </div>
    </Button>
  );
}
