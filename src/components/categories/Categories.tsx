import React, { useContext, useState } from "react";
import { ChevronRight, ChevronLeft, SearchIcon } from "lucide-react";
import { ScrollMenu, VisibilityContext, type publicApiType } from "react-horizontal-scrolling-menu";
import { categoriesData } from "./mocks";
import { Button, Fade, Paper, Popper } from "@mui/material";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./Categories.css";

interface CategoriesProps {
  onSelectCategory: (CategoryName: string) => void;
}

interface CategoriesPopperProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelectCategory: (channelName: string) => void;
}

const LeftArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);
  return (
    <div className="flex items-center">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={isFirstItemVisible}
        className="min-w-auto aspect-[1/1] p-0.5 rounded-full"
        onClick={() => visibility.scrollPrev()}
      >
        <ChevronLeft />
      </Button>
    </div>
  );
};

const RightArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);
  return (
    <div className="flex items-center">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={isLastItemVisible}
        className="min-w-auto aspect-[1/1] p-0.5 rounded-full"
        onClick={() => visibility.scrollNext()}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    onSelectCategory(categoryName);
  };

  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} itemClassName="flex-shrink-0 flex items-center mx-1">
      {categoriesData.map((category) => (
        <div
          key={category.name}
          className={`max-w-48 flex justify-center items-center ${
            selectedCategory === category.name ? "bg-mountain-200" : "hover:bg-mountain-200"
          } cursor-pointer rounded-lg p-2 gap-2`}
          onClick={() => handleCategoryClick(category.name)}
        >
          <img src={category.thumbnail} alt={category.name} className="object-cover object-center w-12 aspect-[1/1] rounded-lg border" />
          <span className="text-sm text-gray-800 line-clamp-2">{category.name}</span>
        </div>
      ))}
    </ScrollMenu>
  );
};

export const CategoryPopper: React.FC<CategoriesPopperProps> = ({ open, anchorEl, onClose, onSelectCategory }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onClose();
  };

  return (
    <Popper sx={{ zIndex: 1200 }} open={open} anchorEl={anchorEl} placement="right" transition className="m-4">
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
                  placeholder="Search in Categorys"
                  aria-label="search"
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="w-full pl-8 p-2 text-inherit transition-width duration-200 border rounded"
                />
              </div>
            </div>
            <div className="px-4">
              {categoriesData
                .filter((category) => category.name.toLowerCase().includes(searchValue.toLowerCase()))
                .map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center hover:bg-mountain-100 cursor-pointer rounded-lg p-2 gap-1"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <img src={category.thumbnail} alt={category.name} className="object-cover object-center w-12 aspect-[1/1] rounded-lg" />
                    <span className="text-sm text-gray-800 text-wrap">{category.name}</span>
                  </div>
                ))}
            </div>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
