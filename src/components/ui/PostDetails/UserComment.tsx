function UserComment({ comment }) {
  return (
    <div>
      <div className="flex items-start mb-2">
        {/* Use the profilePictureUrl prop */}
        <img
          src={comment.author.profilePictureUrl || 'https://via.placeholder.com/32x32'} // Use a default if none provided
          alt={`${comment.author.name}'s Profile`}
          className="w-8 h-8 rounded-full mr-2 shrink-0 object-cover" // Added object-cover
        />
        <div>
          <p className="text-gray-200 font-semibold">{comment.author.name}</p>
          <p className="text-gray-300 text-sm">{comment.text}</p>
          <span className="text-gray-500 text-xs">{comment.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export default UserComment;