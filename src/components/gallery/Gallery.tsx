import React from "react";

import { Photo, RowsPhotoAlbum, RenderPhotoContext } from "react-photo-album";
import "react-photo-album/rows.css";

import { ImageRenderer } from "./ImageRenderer";
import LoadingSpinner from "@/components/fallbacks/LoadingSpinner";

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

  /**
   * Optional custom rendering function for each photo.
   * If not provided, defaults to the basic ImageRenderer.
   * The function receives RenderPhotoProps<GalleryPhoto> from react-photo-album.
   */
  renderPhoto?: (
    _: unknown,
    context: RenderPhotoContext<GalleryPhoto>,
  ) => React.ReactNode;
}

const IGallery: React.FC<IGalleryProps> = ({
  photos,
  isLoading,
  isFetchingNextPage,
  isError,
  error,
  renderPhoto,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError && !isLoading && photos.length === 0) {
    console.error("Error loading initial posts:", error);

    return (
      <div className="p-4 text-center text-mountain-500">
        Oops! Something went wrong while loading the gallery. Please try again
        later.
      </div>
    );
  }

  if (!isLoading && photos.length === 0 && !isFetchingNextPage) {
    return (
      <div className="p-4 text-center text-gray-500">
        No posts found matching your criteria.
      </div>
    );
  }

  const effectiveRenderPhoto = renderPhoto ? renderPhoto : ImageRenderer;

  return (
    <div className="relative pb-20">
      <RowsPhotoAlbum
        rowConstraints={{ singleRowMaxHeight: 256 }}
        spacing={8}
        targetRowHeight={256}
        photos={photos}
        render={{ image: effectiveRenderPhoto }}
      />
      {/* --- Loading More Spinner --- */}
      {isFetchingNextPage && (
        <div className="my-4 text-center">
          <LoadingSpinner />
        </div>
      )}
      {isError && !isLoading && photos.length > 0 && (
        <>
          {console.error("Error fetching more posts:", error)}
          <div className="py-4 text-center text-mountain-500">
            Could not load more posts at this time. Please try again later.
          </div>
        </>
      )}
    </div>
  );
};

export default IGallery;