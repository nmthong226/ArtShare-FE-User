import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@mui/material";

const posts = [
  {
    id: 1,
    username: "Jade",
    handle: "@itsjade",
    time: "19hr",
    text: "Testtttt",
    image: "/logo_app_v_101.png", // Replace with actual path
  },
  {
    id: 2,
    username: "Jade",
    handle: "@itsjade",
    time: "4d",
    text: "",
    image: "/logo_app_v_101.png",
  },
];

interface PortfolioProps {
  isOwner: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({ isOwner }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="bg-black text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <Avatar sx={{ width: 32, height: 32 }} />
                <div className="text-sm">
                  <div className="font-semibold text-white">
                    {post.username}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {post.handle} • {post.time}
                  </div>
                </div>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5 cursor-pointer" />
            </div>
            {post.text && (
              <p className="text-white text-sm mt-3 whitespace-pre-wrap">
                {post.text}
              </p>
            )}
            {post.image && (
              <img
                src={post.image}
                alt="portfolio post"
                className="w-full max-w-[600px] max-h-[338px] object-cover rounded-md mt-3"
              />
            )}

            <div className="flex justify-around text-gray-400 text-sm mt-3">
              <span className="cursor-pointer">💬</span>
              <span className="cursor-pointer">🔁</span>
              <span className="cursor-pointer">❤️</span>
              <span className="cursor-pointer">🔖</span>
              <span className="cursor-pointer">🔗</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Portfolio;
