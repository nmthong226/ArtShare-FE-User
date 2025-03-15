import React from "react";
import { RenderImageProps } from "react-photo-gallery";
import { GalleryPhoto } from "./Gallery";

const ImageRenderer: React.FC<RenderImageProps<GalleryPhoto>> = ({ index, photo, margin }) => {
  const { sizes, srcSet, ...imgProps } = photo;

  const correctSizes = Array.isArray(sizes) ? sizes.join(" ") : sizes;
  const correctSrcSet = Array.isArray(srcSet) ? srcSet.join(", ") : srcSet;

  return (
    <div style={{ margin, height: photo.height, width: photo.width, cursor: "pointer" }}>
      <img
        {...imgProps}
        sizes={correctSizes}
        srcSet={correctSrcSet}
        onClick={() => {
          console.log(123);
        }}
        alt={imgProps.alt || `Image ${index}`}
        className="rounded-lg p-0.5"
      />
    </div>
  );
};

export default ImageRenderer;
