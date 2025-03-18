import React from "react";
import { RenderImageProps } from "react-photo-gallery";
import { GalleryPhoto } from "./Gallery";

import { Images } from "lucide-react";

const ImageRenderer: React.FC<RenderImageProps<GalleryPhoto>> = ({ index, photo, margin }) => {
  const { sizes, srcSet, ...imgProps } = photo;

  const correctSizes = Array.isArray(sizes) ? sizes.join(" ") : sizes;
  const correctSrcSet = Array.isArray(srcSet) ? srcSet.join(", ") : srcSet;

  return (
    <div
      className="relative group overflow-hidden cursor-pointer p-0.5"
      style={{
        margin,
        height: photo.height,
        width: photo.width,
      }}
    >
      <img
        {...imgProps}
        sizes={correctSizes}
        srcSet={correctSrcSet}
        onClick={() => {}}
        alt={imgProps.alt || `Image ${index}`}
        className="rounded-lg w-full h-full object-cover"
      />
      <div className="m-0.5 absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 text-white flex flex-col justify-end items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg p-4">
        {imgProps.postLength > 1 && (
          <div className="absolute top-2 left-2 bg-black/40 p-2 rounded-full flex items-center justify-center">
            <Images size={16} />
          </div>
        )}

        <span className="text-lg font-semibold">{imgProps.title}</span>
        <span className="text-sm">{imgProps.author}</span>
      </div>
    </div>
  );
};

export default ImageRenderer;
