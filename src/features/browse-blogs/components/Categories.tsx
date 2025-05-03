import React, { useEffect, useState } from "react";
import { categoriesData } from "../mocks";
import {
    Button,
    Fade,
    Input,
    Paper,
    Popper,
    PopperPlacementType,
} from "@mui/material";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./Categories.css";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { HorizontalSlider } from "../../../components/HorizontalSlider";
import { cn } from "@/lib/utils";

interface CategoriesProps {
    onSelectCategory: (categoryName: string) => void;
    selectedCategories: string[];
}

interface DataPopperProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onSave: (selectedData: string[]) => void;
    selectedData: string[];
    data: { name: string; thumbnail?: string }[];
    renderItem: string;
    placement?: PopperPlacementType;
    className?: string;
}

export const Categories: React.FC<CategoriesProps> = ({
    onSelectCategory,
    selectedCategories,
}) => {
    const renderCategoryItem = (category: {
        name: string;
        thumbnail?: string;
    }) => {
        const isSelected = selectedCategories.includes(category.name);
        return (
            <div
                className={`relative category-item w-48 flex justify-center items-center 
                ${isSelected ? "bg-mountain-200 dark:bg-mountain-800" : "hover:bg-mountain-100 dark:hover:bg-mountain-900"} 
                cursor-pointer rounded-lg gap-2 p-1 border-indigo-400  
                ${isSelected ? "border-indigo-500" : "border-mountain-50"} border`}
                onClick={() => onSelectCategory(category.name)}
                title={category.name}
                style={{
                    backgroundImage: category.thumbnail ? `url(${category.thumbnail})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay layer */}
                <div className="z-10 absolute inset-0 bg-black/50 rounded-lg" />

                {/* Optional image element (can be removed if using backgroundImage only) */}
                {category.thumbnail && (
                    <img
                        src={category.thumbnail}
                        alt={category.name}
                        className="invisible w-48 h-12"
                        loading="lazy"
                    />
                )}

                {/* Category name */}
                <span className="z-20 absolute px-2 text-mountain-50 dark:text-mountain-200 text-sm text-center line-clamp-2">
                    {category.name}
                </span>
            </div>

        );
    };

    const getCategoryId = (category: { name: string; thumbnail?: string }) => {
        return category.name;
    };

    return (
        <HorizontalSlider
            data={categoriesData}
            renderItem={renderCategoryItem}
            getItemId={getCategoryId}
        />
    );
};

const renderCategoryItem = (
    item: { name: string; thumbnail?: string },
    isSelected: boolean,
    onClick: () => void,
) => (
    <div
        key={item.name}
        className={`flex items-center cursor-pointer ${isSelected ? "bg-mountain-200" : "hover:bg-mountain-100"
            } rounded-lg p-2 gap-1 my-2`}
        onClick={onClick}
    >
        {item.thumbnail && (
            <img
                src={item.thumbnail}
                alt={item.name}
                className="rounded-lg w-12 object-center object-cover aspect-[1/1]"
            />
        )}
        <span className="text-gray-800 text-sm text-wrap">{item.name}</span>
    </div>
);

const renderPropItem = (
    item: { name: string; thumbnail?: string },
    isSelected: boolean,
    onClick: () => void,
) => (
    <div
        key={item.name}
        className="flex items-center gap-2 hover:bg-mountain-100 p-2 rounded-lg cursor-pointer"
        onClick={onClick}
    >
        <input
            type="checkbox"
            id={item.name}
            checked={isSelected}
            className="pointer-events-none"
            readOnly
        />
        <label
            htmlFor={item.name}
            className="w-full text-gray-800 text-sm pointer-events-none"
        >
            {item.name}
        </label>
    </div>
);

export const DataPopper: React.FC<DataPopperProps> = ({
    open,
    anchorEl,
    onClose,
    onSave,
    selectedData: selectedDataProp,
    data,
    renderItem,
    placement,
    className
}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedData, setSelectedData] = useState<string[]>(selectedDataProp);

    useEffect(() => {
        setSelectedData(selectedDataProp);
    }, [selectedDataProp]);

    const handleDataClick = (name: string) => {
        setSelectedData((prev) =>
            prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name],
        );
    };

    return (
        <Popper
            sx={{ zIndex: 1200 }}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
            className="mt-4 mr-4"
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper className={cn('rounded-lg w-72 max-h-[70vh] overflow-y-auto custom-scrollbar', className)}>
                        <div className="top-0 sticky bg-white p-4 border-b w-full">
                            <div className="relative flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl h-10 text-mountain-500">
                                <FiSearch className="left-2 absolute w-5 h-5" />
                                <Input
                                    className="shadow-inner pr-8 pl-8 border-1 border-mountain-500 rounded-2xl w-full h-full"
                                    placeholder="Search"
                                    disableUnderline
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <TiDeleteOutline
                                    className="right-2 absolute w-5 h-5 cursor-pointer"
                                    onClick={() => setSearchQuery("")}
                                />
                            </div>
                        </div>

                        <div className="px-4">
                            {data
                                .filter((item) =>
                                    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
                                )
                                .map((item) =>
                                    (renderItem === "category"
                                        ? renderCategoryItem
                                        : renderPropItem)(
                                            item,
                                            selectedData.includes(item.name),
                                            () => handleDataClick(item.name),
                                        ),
                                )}
                        </div>

                        <div className="bottom-0 sticky flex justify-end gap-2 bg-white p-4 border-t">
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    onClose();
                                    setSelectedData(selectedDataProp);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={() => {
                                    onSave(selectedData);
                                    onClose();
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </Paper>
                </Fade>
            )}
        </Popper>
    );
};
