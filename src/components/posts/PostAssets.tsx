import { Media } from "@/types";

const PostAssets = ({ medias }: { medias: Media[] }) => {
  return (
    <div className={`flex flex-col items-center ${medias.length === 1 && "justify-center"} bg-white shadow pb-4 rounded-2xl h-full w-full overflow-y-scroll no-scrollbar`}>
      {medias &&
        medias.map((media) => (
          <div key={media.url} className="flex justify-center px-4 pt-4 max-h-full">
            {media.media_type == "image"
              ? <img src={media.url} alt={media.description}  className="object-contain"/>
              : <video src={media.url} controls/>
            }
          </div>
        ))}
    </div>
  );
};

export default PostAssets;