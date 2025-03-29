import { Media } from "@/types";

const PostAssets = ({ medias }: { medias: Media[] }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow pb-4 rounded-2xl h-full overflow-y-scroll no-scrollbar">
      {medias &&
        medias.map((media) => (
          <div key={media.url} className="flex justify-center px-4 pt-4 w-full h-[90%]">
            <img src={media.url} alt={media.description} className="w-full h-full object-contain" />
          </div>
        ))}
    </div>
  );
};

export default PostAssets;