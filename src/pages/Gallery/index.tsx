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
      <div className=" sticky top-16 bg-mountain-50 z-50 p-4 flex flex-col gap-4">
        <div className="categories-bar flex items-center gap-6 w-full ">
          <Button className="spread-btn aspect-[1/1] min-w-auto p-2 rounded-lg" variant="contained" disableElevation onClick={handleToggleCP()}>
            <Ellipsis className="text-white" />
          </Button>
          <CategoryPopper open={openCP} anchorEl={anchorElCP} onClose={() => setOpenCP(false)} onSelectCategory={handleCategoryChange} />
          <Button
            className="all-channels-btn flex gap-2 flex-shrink-0 rounded-lg p-2 bg-mountain-200 text-gray-800 normal-case font-normal shadow-none"
            variant="contained"
            onClick={() => handleCategoryChange("All Channels")}
          >
            <Button variant="contained" disableRipple className="aspect-[1/1] min-w-auto p-2 rounded">
              <LoaderPinwheel />
            </Button>
            <span className="flex-shrink-0">All Channels</span>
          </Button>
          <div className="overflow-hidden">
            <Categories onSelectCategory={handleCategoryChange} />
          </div>
        </div>
      </div>
      <div className="p-4 category-name text-3xl font-bold pb-4 text-mountain-800 ">{selectedCategory || "Select a Category"}</div>
      <div className="gallery-area p-4">
        <IGallery />
      </div>
    </div>
  );
};

export default Gallery;
