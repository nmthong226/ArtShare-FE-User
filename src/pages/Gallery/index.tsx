import { useContext, useState } from "react";
import IGallery from "@/components/gallery/Gallery";
import { Categories, DataPopper } from "@/components/categories/Categories";

import { Button } from "@mui/material";

import { Ellipsis, LoaderPinwheel } from "lucide-react";
import { SearchContext } from "@/layouts/public/InAppLayout";
import { categoriesData, propsData } from "@/components/categories/mocks";
import { BsFilter } from "react-icons/bs";

const Gallery: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openCP, setOpenCP] = useState(false);
  const [openPP, setOpenPP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [anchorElPP, setAnchorElPP] = useState<null | HTMLElement>(null);
  const { query } = useContext(SearchContext);

  const handleCategoriesChange = (categoryName: string) => {
    setSelectedCategories((prev) => {
      return prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName];
    });
  };

  const handleToggleCP = () => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCP(event.currentTarget);
    setOpenCP((prevOpen) => !prevOpen);
  };

  const handleTogglePP = () => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPP(event.currentTarget);
    setOpenPP((prevOpen) => !prevOpen);
  };

  return (
    <div className="">
     <div className="top-16 z-50 sticky flex flex-col gap-4 bg-gradient-to-t dark:bg-gradient-to-t from-white dark:from-mountain-1000 to-mountain-50 dark:to-mountain-950 p-4">
        <div className="flex items-center gap-6 w-full categories-bar">
          <Button
            className="flex flex-shrink-0 gap-2 dark:bg-mountain-900 shadow-none p-2 rounded-lg min-w-auto aspect-[1/1] font-normal text-mountain-800 dark:text-mountain-50 normal-case all-channels-btn"
            variant="contained"
            disableElevation
            onClick={handleToggleCP()}
          >
            <Ellipsis />
          </Button>
          <DataPopper
            open={openCP}
            anchorEl={anchorElCP}
            onClose={() => setOpenCP(false)}
            onSave={(categories) => setSelectedCategories(categories)}
            selectedData={selectedCategories}
            data={categoriesData}
            placement="bottom-end"
            renderItem="category"
          />
          <Button
            className={`all-channels-btn flex gap-2 flex-shrink-0 rounded-lg p-2 ${
              selectedCategories.length === 0 ? "bg-mountain-200" : ""
            } text-gray-800 normal-case font-normal shadow-none`}
            variant="outlined"
            onClick={() => setSelectedCategories([])}
          >
            <Button
              variant="contained"
              disableRipple
              disableElevation
              className="p-2 rounded min-w-auto aspect-[1/1]"
            >
              <LoaderPinwheel />
            </Button>
            <span className="flex-shrink-0">All Channels</span>
          </Button>
          <div className="overflow-hidden">
            <Categories
              onSelectCategory={handleCategoriesChange}
              selectedCategories={selectedCategories}
            />
          </div>
          <Button
            className="right-4 bottom-4 z-50 fixed p-2 rounded-lg min-w-auto aspect-[1/1] spread-btn"
            variant="contained"
            disableElevation
            onClick={handleTogglePP()}
          >
            <BsFilter size={32} />
          </Button>
          <DataPopper
            open={openPP}
            onClose={() => setOpenPP(false)}
            onSave={(categories) => setSelectedCategories(categories)}
            anchorEl={anchorElPP}
            data={propsData}
            selectedData={selectedCategories}
            placement="left-end"
            renderItem="prop"
          />
        </div>
      </div>
      <div className="p-4 gallery-area">
        <IGallery query={query} filter={selectedCategories}/>
      </div>
    </div>
  );
};

export default Gallery;
