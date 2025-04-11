import { Category } from "@/types/category";

type RawCategory = {
    id: number;
    name: string;
    cate_name: string;
    createdAt: Date;
    url: string;
};

interface PostTagsProps {
    categories: RawCategory[];
}

const PostTags: React.FC<PostTagsProps> = ({ categories }) => {
    const formattedCategories: Category[] = categories.map((cat) => ({
        id: cat.id,
        cateName: cat.cate_name,
        createdAt: cat.createdAt,
        name: cat.name,
        url: cat.url
    }));
    return (
        <div className="flex flex-col gap-4 bg-white px-4 py-6 rounded-2xl">
            <div className="font-bold text-xl">Categories</div>
            <div className="flex flex-wrap gap-2">
                {formattedCategories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-mountain-50 px-2 py-1 rounded text-xs"
                    >
                        #{category.cateName}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostTags;
