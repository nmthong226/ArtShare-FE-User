import { FacebookIcon, InstagramIcon, PinterestIcon } from "./SocialNetworksIcon";

const socialNetWorks = [
  {
    name: "Facebook",
    icon: FacebookIcon,
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
  },
  {
    name: "Pinterest",
    icon: PinterestIcon,
  },
];

const PostShare: React.FC = () => {
  return (
    <div className="flex flex-col bg-white px-4 py-6 rounded-2xl gap-4">
      <div className="font-bold text-xl">Share</div>
      <div className="flex bg-white rounded-2xl gap-2  flex-wrap">
        {socialNetWorks.map((socialNetWork) => (
          <div className="text-xs px-2 py-1 rounded flex items-center justify-center gap-2 flex-col ">
            {socialNetWork.icon}
            {socialNetWork.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostShare;
