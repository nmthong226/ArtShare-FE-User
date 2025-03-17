import { useState, useEffect } from 'react';
import UserComment from './UserComment';
import * as postsService from '../../../api/postsService';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await postsService.getCommentsForPost(postId);
                setComments(data);
            } catch (err) {
                setError(err.message || "Failed to fetch comments");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);


  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <>
    <h4 className="text-lg text-gray-200 font-semibold mb-4 text-left">
          {comments.length > 1 ? `${comments.length} Comments` : `${comments.length} Comment`}
      </h4>
    <div className='text-left bg-neutral-500 p-4 rounded-lg shadow-md mt-4 text-left'>
      <div className="space-y-3">
        {comments.map(comment => (
          <UserComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
    </>
  );
}

export default CommentSection;