
function PostAuthorCard({ author }) {
  return (
    <div className="flex items-center mb-4">
      {/* Placeholder for profile picture -  replace with actual image */}
      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
      <div>
        <h3 className="font-bold text-gray-900">{author.name}</h3>
        <p className="text-gray-600">@{author.handle}</p>
      </div>
    </div>
  );
}

export default PostAuthorCard;