import { useState } from "react";
import IGallery from "@/components/gallery/Gallery";
import Categories from "@/components/categories/Categories";

import { Button, Divider } from "@mui/material";
import { Ellipsis, LoaderPinwheel } from "lucide-react";

const ExploreGallery: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>("All Channels");

  const handleChannelChange = (channelName: string) => {
    setSelectedChannel(channelName);
  };

  return (
    <div className="px-4">
      <div className="categories-bar flex items-center gap-6 sticky top-0 bg-white">
        <Button className="spread-btn aspect-[1/1] min-w-auto p-2" variant="outlined" disableElevation>
          <Ellipsis className="text-mountain-800" />
        </Button>
        <Button className="all-channel-btn flex gap-2 flex-shrink-0" variant="outlined" onClick={() => handleChannelChange("All Channels")}>
          <Button variant="outlined" disableRipple className="aspect-[1/1] min-w-auto p-2">
            <LoaderPinwheel />
          </Button>
          <span className="flex-shrink-0">All channels</span>
        </Button>
        <div className="overflow-hidden">
          <Categories onSelectChannel={handleChannelChange} />
        </div>
      </div>

      <Divider />

      <div className="gallery-area py-4">
        <div className="channel-name text-xl font-bold mb-4">{selectedChannel || "Select a channel"}</div>
        <IGallery />
      </div>
    </div>
  );
};

export default ExploreGallery;
