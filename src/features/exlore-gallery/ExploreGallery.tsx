import { useState } from "react";
import IGallery from "@/components/gallery/Gallery";
import { Categories, CategoryPopper } from "@/components/categories/Categories";

import { Button, Divider } from "@mui/material";

import { Ellipsis, LoaderPinwheel } from "lucide-react";

const ExploreGallery: React.FC = () => {
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
      <div className=" sticky top-0 bg-white z-50 px-4">
        <div className="categories-bar flex items-center gap-6 w-full">
          <Button className="spread-btn aspect-[1/1] min-w-auto p-2 rounded-lg" variant="outlined" disableElevation onClick={handleToggleCP()}>
            <Ellipsis className="text-mountain-800" />
          </Button>
          <CategoryPopper open={openCP} anchorEl={anchorElCP} onClose={() => setOpenCP(false)} onSelectCategory={handleCategoryChange} />
          <Button
            className="all-channels-btn flex gap-2 flex-shrink-0 rounded-lg p-2"
            variant="outlined"
            onClick={() => handleCategoryChange("All Channels")}
          >
            <Button variant="outlined" disableRipple className="aspect-[1/1] min-w-auto p-2 rounded-lg">
              <LoaderPinwheel />
            </Button>
            <span className="flex-shrink-0">All Channels</span>
          </Button>
          <div className="overflow-hidden">
            <Categories onSelectCategory={handleCategoryChange} />
          </div>
        </div>
        <div className="category-name text-xl font-bold pb-4 text-mountain-800 flex justify-center">{selectedCategory || "Select a Category"}</div>
        <Divider className="border" />
      </div>
      <div className="gallery-area p-4">
        <IGallery />
      </div>
    </div>
  );
};

export default ExploreGallery;
