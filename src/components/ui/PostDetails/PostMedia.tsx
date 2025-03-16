
function PostMedia({ mediaUrl, altText }) {
  //  This example assumes a single image. Adapt for multiple images/videos.
  return (
    <div className="w-full">
      <img src={mediaUrl} alt={altText} className="w-full rounded-lg object-cover" style={{maxHeight: '500px'}}/>
    </div>
  );
}

export default PostMedia;