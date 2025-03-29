// Cores
import { useState } from "react";

// Icons
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { Image, Video } from "lucide-react";

// Components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";

const ExploreNavigation = () => {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={`group  flex items-center border-b-4 h-full ${location.pathname === "/gallery" || location.pathname === "/short" || open
                        ? "border-indigo-300 dark:text-mountain-50 text-mountain-950"
                        : `dark:border-mountain-950 border-white dark:text-mountain-500 text-mountain-700`
                        } `}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    <div className={`hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 ${open && "dark:bg-mountain-1000 bg-mountain-100"} mt-1 p-2 rounded-lg dark:hover:text-mountain-50 hover:cursor-pointer`}>
                        {location.pathname === "/gallery" || location.pathname === "/short" ? (
                            <MdExplore className="w-6 h-6" />
                        ) : (
                            <MdOutlineExplore className="w-6 h-6" />
                        )}
                        <p className="text-sm">Explore</p>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="space-y-2 bg-white dark:bg-mountain-900 ml-10 p-0 py-2 border-mountain-100 dark:border-mountain-700 w-36"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <Link to="/gallery" className={`flex ${location.pathname === "/gallery" ? "bg-mountain-50 dark:bg-mountain-800" : "dark:bg-mountain-900 bg-white"} items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full`}>
                    <Image className="size-4" />
                    <p className="text-sm">Gallery</p>
                </Link>
                <Link to="/short" className={`flex ${location.pathname === "/short" ? "bg-mountain-50 dark:bg-mountain-800" : "dark:bg-mountain-900 bg-white"} items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full`}>
                    <Video className="size-4" />
                    <p className="text-sm">Short</p>
                </Link>
            </PopoverContent>
        </Popover >
    );
};

export default ExploreNavigation;
