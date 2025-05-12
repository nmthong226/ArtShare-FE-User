import React, { useState } from 'react';

//Components
import {
    PopperPlacementType,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';

//Libs
import { cn } from '@/lib/utils';

//Icons
import { Share2, X } from 'lucide-react';
import { LuCopy } from "react-icons/lu";

type ShareDialogProp = {
    tooltipDirection: PopperPlacementType;
    className: string;
    link: string;
};

const Share: React.FC<ShareDialogProp> = ({ tooltipDirection, className, link }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="Share" placement={tooltipDirection} arrow>
                <div onClick={handleOpen} className={cn(className)}>
                    <Share2 className="size-4" />
                </div>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} disableScrollLock>
                <DialogTitle className='flex justify-between items-center'>
                    <p>Share This Blog</p>
                    <X className='size-4 hover:cursor-pointer' onClick={handleClose}/>
                </DialogTitle>
                <DialogContent className='flex flex-col justify-center items-center w-128'>
                    <div className='relative flex justify-end items-center p-1 border-1 rounded-full w-full h-16'>
                        <p className='left-4 absolute text-lg'>{link}</p>
                        <div className='right-8 absolute flex bg-white blur-xl w-42 h-full' />
                        <div className='z-50 flex justify-center items-center space-x-2 bg-mountain-950 hover:bg-mountain-900 rounded-full w-36 h-full text-mountain-50 hover:cursor-pointer'>
                            <LuCopy className='size-5' />
                            <p className='font-medium'>Copy Link</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Share;
