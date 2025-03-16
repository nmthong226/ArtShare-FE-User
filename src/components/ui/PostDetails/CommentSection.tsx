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
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-4">2 Comments</h4> {/* Or dynamic count */}
      <div>
        {comments.map(comment => (
          <UserComment key={comment.id} comment={comment} />
        ))}
        {comments.map(comment => (
          <UserComment key={comment.id} comment={comment} />
        ))}

      </div>
        {/*  Add a form for new comments here if needed */}
    </div>
  );
}

export default CommentSection;