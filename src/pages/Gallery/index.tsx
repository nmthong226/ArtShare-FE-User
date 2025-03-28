import { useState } from "react";
import IGallery from "@/components/gallery/Gallery";
import { Categories, CategoryPopper } from "@/components/categories/Categories";

import { Button } from "@mui/material";

import { Ellipsis, LoaderPinwheel } from "lucide-react";

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("All Channels");
  const [openCP, setOpenCP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);

  const handleCategoryChange = (CategoryName: string) => {
    setSelectedCategory(CategoryName);
  };

  const handleToggleCP = () => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCP(event.currentTarget);
    setOpenCP((prevOpen) => !prevOpen);
  };

  return (
    <div className="">
      <div className="top-16 z-50 sticky flex flex-col gap-4 bg-mountain-50 p-4">
        <div className="flex items-center gap-6 w-full categories-bar">
          <Button className="p-2 rounded-lg min-w-auto aspect-[1/1] spread-btn" variant="contained" disableElevation onClick={handleToggleCP()}>
            <Ellipsis/>
          </Button>
          <CategoryPopper open={openCP} anchorEl={anchorElCP} onClose={() => setOpenCP(false)} onSelectCategory={handleCategoryChange} />
          <Button
            className="flex flex-shrink-0 gap-2 bg-mountain-200 shadow-none p-2 rounded-lg font-normal text-gray-800 normal-case all-channels-btn"
            variant="contained"
            onClick={() => handleCategoryChange("All Channels")}
          >
            <Button variant="contained" disableRipple className="p-2 rounded min-w-auto aspect-[1/1]">
              <LoaderPinwheel />
            </Button>
            <span className="flex-shrink-0">All Channels</span>
          </Button>
          <div className="overflow-hidden">
            <Categories onSelectCategory={handleCategoryChange} />
          </div>
        </div>
      </div>
      <div className="p-4 pb-4 font-bold text-mountain-800 text-3xl category-name">{selectedCategory || "Select a Category"}</div>
      <div className="p-4 gallery-area">
        <IGallery />
      </div>
    </div>
  );
};

export default Gallery;
