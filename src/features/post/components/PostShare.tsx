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
    <div className="flex flex-col gap-4 bg-white px-4 py-6 rounded-2xl">
      <div className="font-bold text-xl">Share</div>
      <div className="flex flex-wrap gap-2 bg-white rounded-2xl justify-center">
        {socialNetWorks.map((socialNetWork) => (
          <div className="flex flex-col justify-center items-center gap-2 px-2 py-1 rounded text-xs">
            {socialNetWork.icon}
            {socialNetWork.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostShare;