const tags = [
    "Digital 2D",
    "Matte Painting",
    "Illustration",
    "NoAI",
    "digital",
    "2D",
    "riot",
    "fortiche",
    "league of legends",
    "matte painting",
];

const PostTags: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 bg-white px-4 py-6 rounded-2xl">
            <div className="font-bold text-xl">Categories</div>
            <div className="flex flex-wrap gap-2 bg-white rounded-2xl">
                {tags.map((tag) => (
                    <div key={tag} className="bg-mountain-50 px-2 py-1 rounded text-xs">
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostTags;