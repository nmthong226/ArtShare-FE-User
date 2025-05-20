import React, { useEffect, useState } from "react";
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
import { HorizontalSlider } from "../../sliders/HorizontalSlider";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { LoaderPinwheel } from "lucide-react";

export interface CategoriesScrollerProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategories: string[];
  data: Category[]; // Data passed from parent
  isLoading?: boolean;
  isError?: boolean;
}

// --- Categories Component ---
export const Categories: React.FC<CategoriesScrollerProps> = ({
  onSelectCategory,
  selectedCategories,
  data,
  isLoading,
  isError,
}) => {
  // Internal rendering logic for an item in the slider
  const renderCategoryItemInSlider = (category: Category) => {
    const isSelected = selectedCategories.includes(category.name);
    const imageUrl =
      category.example_images && category.example_images.length > 0
        ? category.example_images[0]
        : undefined;

    return (
      <div
        className={`category-item max-w-48 flex justify-center items-center ${
          isSelected
            ? "bg-mountain-200 dark:bg-mountain-800"
            : "hover:bg-mountain-100 dark:hover:bg-mountain-900"
        } cursor-pointer rounded-lg p-2 gap-2 border ${
          isSelected ? "border-primary-500" : "border-transparent"
        }`}
        onClick={() => onSelectCategory(category.name)}
        title={category.name}
      >
        <ImageWithFallback
          src={imageUrl}
          alt={category.name}
          className="border dark:border-mountain-700 rounded-lg w-10 h-10 object-center object-cover aspect-[1/1]"
        />
        <span className="text-sm text-mountain-800 dark:text-mountain-200 line-clamp-2">
          {category.name}
        </span>
      </div>
    );
  };

  const getCategoryIdForSlider = (category: Category): string => {
    return category.id.toString();
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 min-h-[76px]">
        {" "}
        {/* min-h to match item height */}
        <LoaderPinwheel className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 min-h-[76px] text-red-500 text-center">
        Failed to load attributes.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 min-h-[76px] text-center text-gray-500">
        No attributes found.
      </div>
    );
  }

  return (
    <HorizontalSlider
      data={data}
      renderItem={renderCategoryItemInSlider}
      getItemId={getCategoryIdForSlider}
    />
  );
};

// ... (The DataPopper and its related functions remain the same for now)
// If DataPopper also needs to be filtered when showing categories,
// the `data` prop passed to it would need to be pre-filtered similarly.

// --- DataPopper and its renderers ---
// (Assuming these are defined below or imported, code from previous response)
interface DataPopperProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSave: (selectedData: string[]) => void;
  selectedData: string[];
  data: Category[]; // If DataPopper is used for categories, this 'data' prop
  // would need to be filtered by its parent if it should also only show ATTRIBUTE types
  renderItem: "category" | "prop";
  placement?: PopperPlacementType;
  className?: string;
}

const renderCategoryItemForPopper = (
  item: Category,
  isSelected: boolean,
  onClick: () => void,
) => {
  const imageUrl =
    item.example_images && item.example_images.length > 0
      ? item.example_images[0]
      : undefined;

  return (
    <div
      className={`flex items-center cursor-pointer ${
        isSelected
          ? "bg-mountain-200 dark:bg-mountain-800"
          : "hover:bg-mountain-100 dark:hover:bg-mountain-900"
      } rounded-lg p-2 gap-2 my-2`}
      onClick={onClick}
    >
      <ImageWithFallback // <<< USE ImageWithFallback HERE
        src={imageUrl}
        alt={item.name}
        className="rounded-lg w-12 h-12 object-center object-cover aspect-[1/1]" // Ensure h-12 for aspect ratio
      />
      <span className="text-sm text-gray-800 dark:text-mountain-200 text-wrap">
        {item.name}
      </span>
    </div>
  );
};

const renderPropItemForPopper = (
  item: Category,
  isSelected: boolean,
  onClick: () => void,
) => (
  <div
    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-mountain-100"
    onClick={onClick}
  >
    <input
      type="checkbox"
      id={`prop-${item.id}-${item.name}`}
      checked={isSelected}
      className="pointer-events-none"
      readOnly
    />
    <label
      htmlFor={`prop-${item.id}-${item.name}`}
      className="w-full text-sm text-gray-800 pointer-events-none"
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
  className,
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
          <Paper
            className={cn(
              "rounded-lg w-72 max-h-[70vh] overflow-y-auto custom-scrollbar",
              className,
            )}
          >
            <div className="sticky top-0 w-full p-4 bg-white border-b">
              {/* Search Input */}
              <div className="relative flex items-center h-10 bg-mountain-50 dark:bg-mountain-1000 rounded-2xl text-mountain-500">
                <FiSearch className="absolute w-5 h-5 left-2" />
                <Input
                  className="w-full h-full pl-8 pr-8 shadow-inner border-1 border-mountain-500 rounded-2xl"
                  placeholder="Search"
                  disableUnderline
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TiDeleteOutline
                  className="absolute w-5 h-5 cursor-pointer right-2"
                  onClick={() => setSearchQuery("")}
                />
              </div>
            </div>

            <div className="px-4">
              {/* Data mapping in Popper */}
              {data // This 'data' prop in DataPopper is NOT automatically filtered by the changes above.
                // If it needs filtering, the parent component instantiating DataPopper must provide filtered data.
                .filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item) => {
                  const renderer =
                    renderItem === "category"
                      ? renderCategoryItemForPopper
                      : renderPropItemForPopper;

                  return React.cloneElement(
                    renderer(item, selectedData.includes(item.name), () =>
                      handleDataClick(item.name),
                    ),
                    { key: item.id },
                  );
                })}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 p-4 bg-white border-t">
              {/* Action Buttons */}
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
