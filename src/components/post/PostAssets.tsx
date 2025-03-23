import { Media } from "@/types";

const PostAssets = ({ medias }: { medias: Media[] }) => {
  return (
    <div className="flex flex-col items-center pb-4 rounded-2xl shadow bg-white h-full overflow-y-scroll no-scrollbar">
      {medias &&
        medias.map((media) => (
          <div key={media.url} className="w-full flex justify-center h-[90%] pt-4 px-4">
            <img src={media.url} alt={media.description} className="object-contain w-full h-full" />
          </div>
        ))}
    </div>
  );
};

export default PostAssets;
