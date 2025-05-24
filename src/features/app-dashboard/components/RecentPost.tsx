import { useEffect, useState } from "react";
import { fetchPosts } from "../../explore/api/get-post";
import { Post } from "@/types";
import { HorizontalSlider } from "@/components/sliders/HorizontalSlider";

const RecentPost = () => {
    const [posts, setPosts] = useState<Post[] | null>([]);
    const getCurentPosts = async () => {
        const posts: Post[] = await fetchPosts(
            1,
            "for-you",
            "",
            [],
        );
        setPosts(posts);
    }
    useEffect(() => {
        getCurentPosts();
    }, []);
    const getPostId = (post: Post) => {
        return post.id;
    };
    const renderPostItem = (post: Post) => {
        return (
            <div
                className={`flex flex-col relative w-72 h-86 justify-center items-center cursor-pointer rounded-lg"}`}
                title={post.title}
            >
                {post.thumbnail_url && (
                    <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="border dark:border-mountain-700 rounded-lg w-fit h-full object-center object-cover aspect-[1/1]"
                        loading="lazy"
                    />
                )}
                <span className="bottom-2 left-2 z-50 absolute font-medium text-mountain-50 dark:text-mountain-200 text-sm line-clamp-2">
                    {post.user.username}
                </span>
            </div>
        );
    };
    return (
        <HorizontalSlider
            data={posts!}
            renderItem={renderPostItem}
            getItemId={getPostId}
            variant="overlay"
        />
    )
}

export default RecentPost