import React, { useContext } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ScrollMenu, VisibilityContext, type publicApiType } from "react-horizontal-scrolling-menu";
import { categoriesData } from "./mocks";
import { Button } from "@mui/material";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./Categories.css";

interface CategoriesProps {
  onSelectChannel: (channelName: string) => void;
}

const LeftArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);
  return (
    <div className="flex items-center">
      <Button
        variant="contained"
        color="secondary"
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
        color="secondary"
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

const Categories: React.FC<CategoriesProps> = ({ onSelectChannel }) => {
  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} itemClassName="flex-shrink-0 flex items-center">
      {categoriesData.map((category) => (
        <div
          key={category.name}
          className="max-w-48 flex justify-center items-center hover:bg-gray-100 cursor-pointer rounded-lg p-2"
          onClick={() => onSelectChannel(category.name)}
        >
          <img src={category.thumbnail} alt={category.name} className="object-cover object-center w-12 aspect-[1/1] rounded-lg" />
          <span className="text-sm text-gray-800">{category.name}</span>
        </div>
      ))}
    </ScrollMenu>
  );
};

export default Categories;
