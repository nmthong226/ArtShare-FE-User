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
import { LuCheck, LuCopy } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';


type ShareDialogProp = {
    tooltipDirection: PopperPlacementType;
    className: string;
    iconClassName?: string;
    link: string;
};

const Share: React.FC<ShareDialogProp> = ({ tooltipDirection, className, link, iconClassName }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setOpen(true)
    };

    const handleClose = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setOpen(false);
        setCopied(false); // Reset when closing dialog
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <>
            <Tooltip title="Share" placement={tooltipDirection} arrow>
                <div onClick={handleOpen} className={cn(className)}>
                    <Share2 className={cn('size-4', iconClassName)} />
                </div>
            </Tooltip>

            <Dialog onClick={(e) => e.stopPropagation()} open={open} onClose={handleClose} disableScrollLock>
                <DialogTitle className="flex justify-between items-center">
                    <p>Share This Blog</p>
                    <X className="size-4 hover:cursor-pointer" onClick={handleClose} />
                </DialogTitle>

                <DialogContent className="flex flex-col justify-center items-center space-y-4 w-106">
                    <div className="relative flex justify-end items-center p-1 border-1 rounded-full w-full h-16">
                        <p className="left-4 absolute text-lg line-clamp-1">{link}</p>
                        <div className="right-8 absolute flex bg-white blur-xl w-42 h-full" />
                        <div
                            onClick={copied ? undefined : handleCopy}
                            className={cn(
                                'z-50 flex justify-center items-center space-x-2 rounded-full w-36 h-full text-mountain-50 font-medium transition-all duration-200',
                                copied ? 'bg-mountain-700 hover:cursor-not-allowed' : 'bg-mountain-950 hover:bg-mountain-900 hover:cursor-pointer'
                            )}
                        >
                            {copied ? (
                                <>
                                    <LuCheck className="size-5" />
                                    <p>Copied</p>
                                </>
                            ) : (
                                <>
                                    <LuCopy className="size-5" />
                                    <p>Copy Link</p>
                                </>
                            )}
                        </div>
                    </div>

                    <hr className="flex border-mountain-200 border-t-1 w-full" />
                    <span className="text-xs">Or using other embedded links</span>

                    <div className="flex justify-center space-x-8 w-full">
                        <SocialButton icon={<FaLinkedin className="size-5 group-hover:text-white" />} label="Linkedin" color="bg-cyan-700/80" />
                        <SocialButton icon={<FaFacebookF className="size-5 group-hover:text-white" />} label="Facebook" color="bg-blue-900/80" />
                        <SocialButton icon={<FaXTwitter className="size-5 group-hover:text-white" />} label="X" color="bg-mountain-950" />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const SocialButton = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
    <div className="group flex flex-col justify-center items-center space-y-2 hover:cursor-pointer">
        <div className={cn('flex justify-center items-center bg-mountain-100 rounded-full w-12 h-12', `group-hover:${color}`)}>
            {icon}
        </div>
        <span className="text-xs">{label}</span>
    </div>
);

export default Share;