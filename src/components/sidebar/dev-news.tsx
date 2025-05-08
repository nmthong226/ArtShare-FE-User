import React from 'react'

//Api/Hooks

//Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//Icons
import { BsChevronExpand } from "react-icons/bs";
import { LuLogs } from "react-icons/lu";

type DevNewsProps = {
    expand: boolean
}

const DevNews: React.FC<DevNewsProps> = ({ expand }) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='flex justify-center items-center mt-4 w-full h- h-12'>
                <div className={`${!expand ? 'opacity-0 w-0 hidden' : "px-4"} duration-500 ease-in-out flex items-center justify-between hover:bg-gray-100 rounded-lg h-full w-full`}>
                    <div className={`flex items-center space-x-2`}>
                        <LuLogs className='flex-none shrink-0' />
                        <p className={`transition-all duration-300 font-normal origin-left ${expand ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'} line-clamp-1 text-sm`}>
                            What’s New<span className='text-mountain-400'> - DevLog</span>
                        </p>
                    </div>
                    <BsChevronExpand />
                </div>
                <p className={`${expand ? 'opacity-0 w-0' : 'opacity-100 w-fit'} shadow px-1 py-2 border border-mountain-100 rounded-lg text-mountain-600 text-sm`}>News</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mb-2 ml-2 border-mountain-100 w-56" side='right'>
                <DropdownMenuLabel className="flex flex-col space-y-1">
                    <p>ArtShare - Beta</p>
                    <p className="font-normal text-moutain-600 text-xs">v1.4.0</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className='text-mountain-600 hover:text-mountain-950 duration-200 transform'>
                        <span className='line-clamp-1'>29/04/25 - Rework Layout</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-mountain-600 hover:text-mountain-950 duration-200 transform'>
                        <span className='line-clamp-1'>28/04/25 - Image Editor</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DevNews