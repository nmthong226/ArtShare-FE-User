// Core
import { useState } from "react";

// Components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

//Icons
import { PiStarFourFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";

interface TokenPopoverProps {
    tokenNumber: number
}

const TokenPopover: React.FC<TokenPopoverProps> = ({ tokenNumber }) => {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    onMouseEnter={() => setOpen(true)}
                    className='flex px-2 border-mountain-100 border-r-2 border-l-2 h-full'>
                    <div className='flex justify-center items-center space-x-2 bg-mountain-100 px-2 rounded-lg w-fit h-full font-normal'>
                        <p>{tokenNumber}</p>
                        <PiStarFourFill className='size-5' />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="dark:bg-mountain-900 mt-4 p-3 border-mountain-100 dark:border-mountain-700 w-80"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <div className="flex flex-col space-y-2">
                    <p className="inline-block bg-clip-text bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-700 w-fit font-medium text-transparent text-3xl">{tokenNumber}</p>
                    <p>credits remaining, get more with</p>
                    <Button>Upgrade</Button>
                </div>
                <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
                <div className="flex flex-col space-y-2">
                    <p className="text-mountain-700 text-sm">Generations remaining based on your credits</p>
                    <div className="flex w-full">
                        <p className="flex w-1/2">~{Math.floor(tokenNumber / 5) > 1 ? Math.floor(tokenNumber / 5) + ' Images' : Math.floor(tokenNumber / 5) + ' Image'}</p>
                        <p className="flex w-1/2">~{Math.floor(Math.floor(tokenNumber / 25)) > 1 ? Math.floor(tokenNumber / 25) + ' Videos' : Math.floor(tokenNumber / 25) + ' Video'}</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default TokenPopover;