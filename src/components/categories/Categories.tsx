import React, { useContext } from "react";

import { ChevronRight, ChevronLeft } from "lucide-react";

import { ScrollMenu, VisibilityContext, type publicApiType } from "react-horizontal-scrolling-menu";

import { categoriesData } from "./mocks";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./Categories.css";

const LeftArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);
  return (
    <button disabled={isFirstItemVisible} onClick={() => visibility.scrollPrev()}>
      <ChevronLeft />
    </button>
  );
};

const RightArrow = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);
  return (
    <button disabled={isLastItemVisible} onClick={() => visibility.scrollNext()}>
      <ChevronRight />
    </button>
  );
};

const Categories: React.FC = () => {
  return (
    <div className="flex w-screen items-center flex-col bg-zinc-50">
      <div className="container mx-auto">
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} itemClassName="flex-shrink-0">
          {categoriesData.map((category) => (
            <div key={category.name} className="max-w-48 flex justify-center items-center hover:bg-gray-100 cursor-pointer rounded-lg p-2">
              <img src={category.thumbnail} alt={category.name} className="object-cover object-center w-12 aspect-[1/1] rounded-lg" />
              <span className="text-sm text-gray-800 ">{category.name}</span>
            </div>
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

export default Categories;
