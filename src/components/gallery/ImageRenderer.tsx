// PhotoRenderer.tsx
import { RenderPhotoContext } from "react-photo-album";
import { Link } from "react-router-dom";
import { GalleryPhoto } from "./Gallery";
import { Images } from "lucide-react";

export const ImageRenderer = (_: unknown, context: RenderPhotoContext<GalleryPhoto>) => {
  const { photo, height, width, index } = context;
  return (
    <div
      className="relative group overflow-hidden cursor-pointer"
      style={{
        height: height,
        width: width,
      }}
    >
      <Link to={`/posts/${photo.postId}`} className="block w-full h-full">
        <img
          {...photo}
          srcSet={Array.isArray(photo.srcSet) ? photo.srcSet.join(", ") : photo.srcSet}
          alt={photo.alt || `Image ${index}`}
          className="rounded-lg w-full h-full object-cover"
        />
        <div className="m-0.5 absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 text-white flex flex-col justify-end items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg p-4">
          {photo.postLength > 1 && (
            <div className="absolute top-2 left-2 bg-black/40 p-2 rounded-full flex items-center justify-center">
              <Images size={16} />
            </div>
          )}
          <span className="text-lg font-semibold">{photo.title}</span>
          <span className="text-sm">{photo.author}</span>
        </div>
      </Link>
    </div>
  );
};
