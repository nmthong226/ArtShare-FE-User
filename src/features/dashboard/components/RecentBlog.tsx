// import BlogCard from "@/components/cards/BlogCard";
import { HorizontalSlider } from "@/components/sliders/HorizontalSlider";
import { Blog } from "@/types/blog";
import { useState } from "react";

const RecentBlog = () => {
    const [blogs] = useState<Blog[] | null>(null);

    const getBlogId = (Blog: Blog) => {
        return Blog.id;
    };

    const renderBlogItem = (blog: Blog) => {
        return (
            <div
                className={`flex flex-col relative w-72 h-86 justify-center items-center cursor-pointer rounded-lg"}`}
                title={blog.title}
            >
                {blog.pictures && (
                    <img
                        src={blog.pictures[0]}
                        alt={blog.title}
                        className="border dark:border-mountain-700 rounded-lg w-fit h-full object-center object-cover aspect-[1/1]"
                        loading="lazy"
                    />
                )}
                <span className="bottom-2 left-2 z-50 absolute font-medium text-mountain-50 dark:text-mountain-200 text-sm line-clamp-2">
                    {blog.user.username}
                </span>
            </div>
        );
    };

    return (
        <HorizontalSlider
            data={blogs!}
            renderItem={renderBlogItem}
            getItemId={getBlogId}
            variant="overlay"
        />
    )
}

export default RecentBlog