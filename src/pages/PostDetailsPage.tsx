import CommentSection from '@/components/ui/PostDetails/CommentSection';
import PostAuthorCard from '@/components/ui/PostDetails/PostAuthorCard';
import PostMedia from '@/components/ui/PostDetails/PostMedia';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as postsService from "../api/postsService"

function PostDetailsPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const descriptionLimit = 150;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsService.getPostById(postId);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-8">Error: {error}</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found.</div>;
  }

    const displayedDescription = showMore ? post.description : post.description.substring(0, descriptionLimit);
    const showMoreButton = post.description.length > descriptionLimit;

    return (
        <div className='bg-stone-600'>
          {/* <Header /> */}
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row"> {/* Main container, responsive layout */}
    
            {/* Left Column (Post Content) */}
            <div className="w-full md:w-2/3 md:pr-8 mb-8 md:mb-0"> {/* Responsive width, padding, and margin */}
              <PostMedia mediaUrl={post.imageUrl} altText={post.title} />
              <PostMedia mediaUrl={post.imageUrl} altText={post.title} />
              <PostMedia mediaUrl={post.imageUrl} altText={post.title} />
            </div>
    
            {/* Right Column (Author Card and Comments) */}
            <div className="w-full md:w-1/3 md:pl-8"> {/* Responsive width and padding */}
            {/* Card Container */}
          <div className="bg-neutral-500 p-4 rounded-lg shadow-md mt-4 text-left">
            <PostAuthorCard author={post.author} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <p className="text-gray-200 mb-2">
              {displayedDescription}
              {showMoreButton && !showMore && <span>...</span>}
            </p>
            {showMoreButton && (
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="text-gray-200 underline hover:text-gray-300 cursor-pointer"
              >
                {showMore ? 'Show Less' : 'Show More'}
              </button>
            )}
            <p className="text-gray-300 mt-2 mb-2">Posted {post.postedDate}</p>


            <div className='w-full border-b border-gray-100'></div>
            <div className="mt-2 mb-2 flex items-between space-x-5">
              {/* Likes, Comments, Save buttons */}
              <button className="flex items-center text-gray-200 hover:text-blue-600">
                <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center text-gray-200 hover:text-blue-600">
                <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center text-gray-200 hover:text-blue-600">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                <span>Save</span>
              </button>
            </div>
            <div className='w-full border-b border-gray-100'></div>
          </div> {/* End of Card Container */}
              <CommentSection postId={postId} />
            </div>
    
          </div>
        </div>
      );
}

export default PostDetailsPage;