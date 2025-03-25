import React, { useContext, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ScrollMenu, VisibilityContext, type publicApiType } from "react-horizontal-scrolling-menu";
import { categoriesData } from "./mocks";
import { Button, Fade, Input, Paper, Popper } from "@mui/material";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./Categories.css";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

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
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onClose();
  };

  return (
    <Popper sx={{ zIndex: 1200 }} open={open} anchorEl={anchorEl} placement="right" transition className="m-4">
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className="h-[70vh] overflow-y-auto w-72">
            <div className="sticky top-0 bg-white p-4 w-full">
              <div className="relative flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl h-10 text-mountain-500 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-mountain-400">
                <FiSearch className="left-2 absolute w-5 h-5" />
                <Input
                  className="shadow-inner pr-8 pl-8 border-1 border-mountain-500 rounded-2xl w-full h-full"
                  placeholder="Search"
                  disableUnderline
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TiDeleteOutline className="right-2 absolute w-5 h-5" onClick={() => setSearchQuery("")} />
              </div>
            </div>
            <div className="px-4">
              {categoriesData
                .filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
