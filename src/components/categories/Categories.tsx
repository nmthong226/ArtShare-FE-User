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
                className="p-0.5 rounded-full min-w-auto aspect-[1/1]"
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
        <div className="flex items-center shadow-2xl">
            <Button
                variant="contained"
                color="primary"
                disableElevation
                disabled={isLastItemVisible}
                className="p-0.5 rounded-full min-w-auto aspect-[1/1]"
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
                    className={`max-w-48 flex justify-center items-center ${selectedCategory === category.name ? "bg-mountain-100 dark:bg-mountain-900" : "hover:bg-mountain-100 dark:hover:bg-mountain-900"
                        } cursor-pointer rounded-lg p-2 gap-2`}
                    onClick={() => handleCategoryClick(category.name)}
                >
                    <img src={category.thumbnail} alt={category.name} className="border rounded-lg w-12 object-center object-cover aspect-[1/1]" />
                    <span className="text-mountain-800 dark:text-mountain-300 text-sm line-clamp-2">{category.name}</span>
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
        <Popper sx={{ zIndex: 1200 }} open={open} anchorEl={anchorEl} placement="bottom" transition className="mt-4 ml-18">
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper className="bg-white dark:bg-mountain-950 w-72 h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="top-0 sticky bg-mountain-50 dark:bg-mountain-950 p-4 w-full">
                            <div className="relative flex items-center bg-white dark:bg-mountain-1000 rounded-2xl h-10 text-mountain-500 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-mountain-400">
                                <FiSearch className="left-2 absolute w-5 h-5" />
                                <Input
                                    className="shadow-inner pr-8 pl-8 border-1 border-mountain-500 rounded-2xl w-full h-full text-mountain-950 dark:text-mountain-50"
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
                                        className="flex items-center gap-1 hover:bg-mountain-100 dark:hover:bg-mountain-800 p-2 rounded-lg cursor-pointer"
                                        onClick={() => handleCategoryClick(category.name)}
                                    >
                                        <img src={category.thumbnail} alt={category.name} className="rounded-lg w-12 object-center object-cover aspect-[1/1]" />
                                        <span className="text-mountain-800 dark:text-mountain-100 text-sm text-wrap">{category.name}</span>
                                    </div>
                                ))}
                        </div>
                    </Paper>
                </Fade>
            )}
        </Popper>
    );
};