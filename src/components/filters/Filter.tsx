import { Dispatch, SetStateAction, useState } from "react";
import { X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface CategoryListProps {
    selectedCategories: string[];
    setSelectedCategories: Dispatch<SetStateAction<string[]>>;
}

const CategoryList: React.FC<CategoryListProps> = ({
    selectedCategories,
    setSelectedCategories,
}) => {
    const maxVisible = 5;
    const visibleCategories = selectedCategories.slice(0, maxVisible);
    const hiddenCategories = selectedCategories.slice(maxVisible);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center">
            {visibleCategories.map((cate, index) => (
                <div
                    key={index}
                    className="flex justify-center items-center bg-white shadow mx-1 px-4 rounded-lg h-10"
                >
                    <p className="mr-2 text-sm line-clamp-1">{cate}</p>
                    <X
                        className="size-4 text-mountain-400 hover:text-red-600 cursor-pointer"
                        onClick={() =>
                            setSelectedCategories((prev) => prev.filter((c) => c !== cate))
                        }
                    />
                </div>
            ))}

            {hiddenCategories.length > 0 && (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <div
                            className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 shadow mx-1 px-3 py-1 border border-mountain-200 rounded-lg h-10 text-sm cursor-pointer"
                            onMouseEnter={() => setIsOpen(true)}
                        >
                            + {hiddenCategories.length} categories
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        side="bottom"
                        className="flex flex-col mt-1 p-0 py-2 border-none w-48"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {hiddenCategories.map((cate, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center hover:bg-gray-100 px-2 py-1 rounded"
                            >
                                <p className="mr-2 text-sm">{cate}</p>
                                <X
                                    className="size-4 text-mountain-400 hover:text-red-600 cursor-pointer"
                                    onClick={() =>
                                        setSelectedCategories((prev) =>
                                            prev.filter((c) => c !== cate)
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};

export default CategoryList;
