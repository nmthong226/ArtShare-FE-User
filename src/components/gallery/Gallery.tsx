import React from "react";
import { Photo, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import { ImageRenderer } from "./ImageRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";

export interface GalleryPhoto extends Photo {
  key: string;
  title: string;
  author: string;
  postLength: number;
  postId: number;
}

interface IGalleryProps {
  photos: GalleryPhoto[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  error: Error | null;
}

const IGallery: React.FC<IGalleryProps> = ({
  photos,
  isLoading,
  isFetchingNextPage,
  isError,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error loading posts: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!isLoading && photos.length === 0 && !isFetchingNextPage) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No posts found matching your criteria.
      </div>
    );
  }

  return (
    <div className="relative pb-20">
      <RowsPhotoAlbum
        spacing={8}
        targetRowHeight={256}
        photos={photos}
        render={{ image: ImageRenderer }}
      />
      {isFetchingNextPage && (
        <div className="my-4 text-center">
          <LoadingSpinner />
        </div>
      )}
      {isError && !isLoading && (
        <div className="text-red-500 text-center py-4">
          Error fetching more posts: {(error as Error)?.message}
        </div>
      )}
    </div>
  );
};

export default IGallery;
