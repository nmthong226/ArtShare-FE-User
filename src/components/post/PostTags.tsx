const tags = [
  "#Digital 2D",
  "#Matte Painting",
  "#Illustration",
  "#NoAI",
  "#digital",
  "#2D",
  "#riot",
  "#fortiche",
  "#league of legends",
  "#matte painting",
];

const PostTags: React.FC = () => {
  return (
    <div className="flex flex-col bg-white px-4 py-6 rounded-2xl gap-4">
      <div className="font-bold text-xl">Tags</div>
      <div className="flex bg-white flex-wrap rounded-2xl gap-2">
        {tags.map((tag) => (
          <div key={tag} className="text-xs bg-mountain-50 px-2 py-1 rounded">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTags;
