// PhotoRenderer.tsx
import { RenderPhotoContext } from "react-photo-album";
import { Link } from "react-router-dom";
import { GalleryPhoto } from "./Gallery";
import { Images } from "lucide-react";

// Icons
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineEye } from "react-icons/hi";

export const ImageRenderer = (
  _: unknown,
  context: RenderPhotoContext<GalleryPhoto>
) => {
  const { photo, height, width, index } = context;
  return (
    <div
      className="group relative overflow-hidden cursor-pointer"
      style={{
        height: height,
        width: width,
      }}
    >
      <Link to={`/posts/${photo.postId}`} className="block w-full h-full">
        <img
          {...photo}
          srcSet={
            Array.isArray(photo.srcSet) ? photo.srcSet.join(", ") : photo.srcSet
          }
          alt={photo.alt || `Image ${index}`}
          className="rounded-lg w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end items-start bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 p-4 rounded-lg text-white transition-opacity duration-300">
          {photo.postLength > 1 && (
            <div className="top-2 left-2 absolute flex justify-center items-center bg-black/40 p-2 rounded-full">
              <Images size={16} />
            </div>
          )}
          <div className="flex justify-between items-end w-full">
            <div>
              <span className="font-semibold text-md line-clamp-1">
                {photo.title}
              </span>
              <span className="text-xs line-clamp-1">{photo.author}</span>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center space-x-1">
                <p className="font-semibold">{9}</p>
                <AiOutlineLike className="size-4" />
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-semibold">23</p>
                <BiCommentDetail className="size-4 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-semibold">1k</p>
                <HiOutlineEye className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
