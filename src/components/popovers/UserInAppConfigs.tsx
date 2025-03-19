// Core
import { useState } from 'react'

// Context/hooks
import { useTheme } from '@/context/ThemeProvider';

// Icons
import { FaReact } from "react-icons/fa";
import { Switch } from '@/components/ui/switch';
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

// Components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';


const UserInAppConfigs = () => {
    const [open, setOpen] = useState(false);
    const { toggleTheme } = useTheme();

    const [matureContent, setMatureContent] = useState(false);
    const [aiContent, setAiContent] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div>
                    <Button
                        variant="ghost"
                        title="More"
                        className="bg-gradient-to-b from-blue-800 to-pink-800 w-8 h-8"
                        onMouseEnter={() => setOpen(true)}
                    >
                        <FaReact className="size-5 text-white" />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="dark:bg-mountain-900 mt-4 p-0 py-2 dark:border-mountain-700 w-64"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
                    <span className='text-sm'>Theme</span>
                    <div className='flex space-x-2'>
                        <Button onClick={toggleTheme} className={`border-2 border-indigo-600 dark:border-mountain-600 dark:bg-mountain-800 rounded-full size-8`} variant={"outline"}>
                            <MdLightMode className='size-5' />
                        </Button>
                        <Button onClick={toggleTheme} className={`rounded-full dark:border-2 dark:border-indigo-600 dark:bg-mountain-800 size-8`} variant={"outline"}>
                            <MdDarkMode className='size-5' />
                        </Button>
                    </div>
                </div>
                <hr className='my-2 border-mountain-100 dark:border-mountain-800 border-t-1' />
                <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
                    <span className='text-sm'>Mature Content</span>
                    <Switch checked={matureContent} onCheckedChange={setMatureContent} className='hover:cursor-pointer' />
                </div>
                <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
                    <span className='text-sm'>AI Content</span>
                    <Switch checked={aiContent} onCheckedChange={setAiContent} className='hover:cursor-pointer' />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default UserInAppConfigs;