// import BlogCard from "@/components/cards/BlogCard";
import { useEffect, useRef, useState } from "react";
import { BlogList } from "@/utils/mocks";
import { CircularProgress } from "@mui/material";
import BlogItem from "@/components/lists/BlogItem";

const RecentBlog = () => {
    const [loading, setLoading] = useState(true);
    const blogAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (BlogList.length === 0) return;

        let loadedCount = 0;
        const totalImages = BlogList.length;

        const handleImageLoad = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setLoading(false);
            }
        };

        BlogList.forEach((blog) => {
            const img = new Image();
            img.src = blog.thumbnail;
            img.onload = handleImageLoad;
            img.onerror = handleImageLoad; // handle broken image case
        });
    }, [BlogList]);

    return (
        <div className="flex rounded-t-3xl h-screen overflow-hidden">
            {loading ?
                <div className="flex justify-center items-center space-x-4 w-full h-full sidebar">
                    <CircularProgress size={36} />
                    <p>Loading...</p>
                </div> :
                <>
                    <div className="relative flex flex-col flex-1 pb-22 w-full h-full">
                        <div
                            ref={blogAreaRef}
                            className="flex flex-col gap-y-4 space-y-12 p-4">
                            {BlogList.slice(0, 3).map((blog) => (
                                <BlogItem
                                    blogId={blog.blogId}
                                    title={blog.title}
                                    content={blog.content}
                                    thumbnail={blog.thumbnail}
                                    author={blog.user}
                                    timeReading={blog.timeReading}
                                    dateCreated={blog.dateCreated}
                                    category={blog.category}
                                    like_count={blog.like_count}
                                    comment_count={blog.comment_count}
                                    view_count={blog.view_count}
                                />
                            ))}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default RecentBlog