import { useState } from "react";
import IGallery from "@/components/gallery/Gallery";
import Categories from "@/components/categories/Categories";

import { Button, Divider, Fade, Paper, Popper } from "@mui/material";

import { Ellipsis, LoaderPinwheel, SearchIcon } from "lucide-react";

import { categoriesData } from "@/components/categories/mocks";

const ExploreGallery: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>("All Channels");
  const [openCP, setOpenCP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [searchValueCP, setSearchValueCP] = useState<string>("");

  const handleChannelChange = (channelName: string) => {
    setSelectedChannel(channelName);
  };

  const handleToggleCP = () => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCP(event.currentTarget);
    setOpenCP((prevOpen) => !prevOpen);
  };

  return (
    <div className="px-4">
      <div className="categories-bar flex items-center gap-6 sticky top-0 bg-white">
        <Button className="spread-btn aspect-[1/1] min-w-auto p-2" variant="outlined" disableElevation onClick={handleToggleCP()}>
          <Ellipsis className="text-mountain-800" />
        </Button>
        <Popper sx={{ zIndex: 1200 }} open={openCP} anchorEl={anchorElCP} placement={"right"} transition className="m-4">
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className="h-[70vh] overflow-y-auto max-w-72">
                <div className="sticky top-0 bg-white p-4 w-full">
                  <div className="relative rounded bg-mountain-50 bg-opacity-15 hover:bg-opacity-25 w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center justify-center px-2 pointer-events-none">
                      <SearchIcon size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search in channels"
                      aria-label="search"
                      onChange={(event) => setSearchValueCP(event.target.value)}
                      className="w-full pl-8 p-2 text-inherit transition-width duration-200 border"
                    />
                  </div>
                </div>
                <div className="px-4">
                  {categoriesData
                    .filter((category) => category.name.toLowerCase().includes(searchValueCP.toLowerCase()))
                    .map((category) => (
                      <div className="flex items-center hover:bg-mountain-100 cursor-pointer rounded-lg p-2">
                        <img src={category.thumbnail} alt={category.name} className="object-cover object-center w-12 aspect-[1/1] rounded-lg" />
                        <span className="text-sm text-gray-800 text-wrap">{category.name}</span>
                      </div>
                    ))}
                </div>
              </Paper>
            </Fade>
          )}
        </Popper>
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
