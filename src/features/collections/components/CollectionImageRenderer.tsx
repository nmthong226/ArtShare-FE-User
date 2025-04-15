import React from "react";

import { RenderPhotoContext } from "react-photo-album";
import { Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { Images } from "lucide-react";

import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineEye } from "react-icons/hi";
import { SelectedCollectionId } from "@/features/collections";
import { GalleryPhoto } from "../gallery/Gallery";

export interface CollectionImageRendererOptions {
  onRemovePost: (postId: number) => void;
  selectedCollectionId: SelectedCollectionId;
}

export const CollectionImageRenderer = (
  context: RenderPhotoContext<GalleryPhoto>,
  options: CollectionImageRendererOptions,
) => {
  const { photo, width, height } = context;

  const { onRemovePost, selectedCollectionId } = options;

  const canDelete = typeof selectedCollectionId === "number";

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onRemovePost(photo.postId);
  };

  return (
    <div
      className="group relative overflow-hidden cursor-pointer border border-transparent hover:border-gray-300 rounded-lg"
      style={{
        height: height,
        width: width,
      }}
    >
      {/* --- Delete Button --- */}
      {/* Conditionally render based on canDelete */}
      {canDelete && (
        <Tooltip title="Remove from collection">
          <IconButton
            aria-label="Remove from collection"
            size="small"
            onClick={handleDeleteClick}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(200, 0, 0, 0.8)",
                opacity: 1,
              },

              ".group:hover &": {
                opacity: 1,
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {/* --- End Delete Button --- */}

      {/* --- Original Link and Image Structure --- */}
      <Link to={`/posts/${photo.postId}`} className="block w-full h-full">
        <img
          key={photo.key || photo.src}
          src={photo.src}
          loading="lazy"
          className="rounded-lg w-full h-full object-cover"
          style={{ display: "block" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-start bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 p-4 rounded-lg text-white transition-opacity duration-300 pointer-events-none">
          {" "}
          {/* pointer-events-none on overlay */}
          {/* Multiple Images Icon */}
          {photo.postLength > 1 && (
            <div className="top-2 left-2 absolute flex justify-center items-center bg-black/40 p-1 rounded-full pointer-events-auto">
              {" "}
              {/* pointer-events-auto here */}
              <Images size={14} />
            </div>
          )}
          {/* Text and Stats */}
          <div className="flex justify-between items-end w-full">
            <div>
              <span className="font-semibold text-md line-clamp-1">
                {photo.title}
              </span>
              <span className="text-xs line-clamp-1">{photo.author}</span>
            </div>
            {/* Stats section (Copied from original - replace hardcoded numbers) */}
            <div className="flex flex-col items-end space-y-1 pointer-events-auto">
              {" "}
              {/* pointer-events-auto here if stats are interactive */}
              <div className="flex items-center space-x-1">
                {/* TODO: Replace with actual data if available */}
                <p className="font-semibold text-sm">9</p>
                <AiOutlineLike className="size-4" />
              </div>
              <div className="flex items-center space-x-1">
                {/* TODO: Replace with actual data if available */}
                <p className="font-semibold text-sm">23</p>
                <BiCommentDetail className="size-4 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {/* TODO: Replace with actual data if available */}
                <p className="font-semibold text-sm">1k</p>
                <HiOutlineEye className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* --- End Original Link and Image Structure --- */}
    </div>
  );
};
