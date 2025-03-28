// PhotoRenderer.tsx
import { RenderPhotoContext } from "react-photo-album";
import { Link } from "react-router-dom";
import { GalleryPhoto } from "./Gallery";
import { Images } from "lucide-react";

export const ImageRenderer = (_: unknown, context: RenderPhotoContext<GalleryPhoto>) => {
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
                    srcSet={Array.isArray(photo.srcSet) ? photo.srcSet.join(", ") : photo.srcSet}
                    alt={photo.alt || `Image ${index}`}
                    className="rounded-lg w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end items-start bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 m-0.5 p-4 rounded-lg text-white transition-opacity duration-300">
                    {photo.postLength > 1 && (
                        <div className="top-2 left-2 absolute flex justify-center items-center bg-black/40 p-2 rounded-full">
                            <Images size={16} />
                        </div>
                    )}
                    <span className="font-semibold text-lg">{photo.title}</span>
                    <span className="text-sm">{photo.author}</span>
                </div>
            </Link>
        </div>
    );
};