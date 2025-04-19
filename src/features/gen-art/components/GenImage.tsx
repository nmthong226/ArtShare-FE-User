import React, { useState, ElementType, useEffect } from 'react'

//Libs
import ShowMoreText from "react-show-more-text";

//Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

//Assets
import example_1 from "../assets/1.webp"

//Icons
import { IoIosSquareOutline } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Button } from '@mui/material';
import { FiDownload } from "react-icons/fi";
import { RiFolderUploadLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";

interface PromptResult {
    id: string,
    url: string
}

interface GenImageProps {
    index: number,
    imageId: string,
    resultId: string,
    image: string,
    images: PromptResult[],
    prompt: string,
    onDelete?: (resultId: string, imgId: string) => void;
}

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;


const GenImage: React.FC<GenImageProps> = ({ index, imageId, resultId, image, images, prompt, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [openDiaLog, setOpenDiaLog] = useState(false);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNav = (index: number) => {
        if (index >= 0 && index < images.length) {
            setCurrentIndex(index);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handleDownload = () => {
        const currentImageUrl = images[currentIndex].url;
        const link = document.createElement('a');
        link.href = currentImageUrl;
        link.download = `image-${currentIndex + 1}.jpg`; // or use original file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (open) {
            timeout = setTimeout(() => {
                onDelete?.(resultId, imageId);
                setOpen(false); // Close dialog after delete
                setOpenDiaLog(false);
            }, 2000);
        }

        return () => clearTimeout(timeout);
    }, [open]);

    return (
        <Dialog open={openDiaLog} onOpenChange={setOpenDiaLog}>
            <DialogTrigger asChild>
                <img
                    src={image}
                    alt={`Image ${imageId}`}
                    loading="lazy"
                    className='shadow-md cursor-pointer'
                    style={{ borderRadius: '8px' }}
                    onClick={() => { setCurrentIndex(index), setOpenDiaLog(true) }}
                />
            </DialogTrigger>
            <DialogContent className='p-0 border-0 rounded-xl min-w-7xl'>
                <DialogHeader hidden>
                    <DialogTitle>Image Preview</DialogTitle>
                    <DialogDescription>Image Description</DialogDescription>
                </DialogHeader>
                <div className='relative flex h-[680px]'>
                    <div className='relative bg-mountain-100 rounded-l-xl w-[65%] h-[680px] overflow-hidden'>
                        {/* Image Slider */}
                        <div className="flex justify-center items-center w-full h-full">
                            <div
                                className="flex h-full transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                    width: `${images.length * 100}%`,
                                }}
                            >
                                {images.map((_img, index) => (
                                    <div key={index} className="flex flex-shrink-0 justify-center items-center w-full h-full">
                                        <img
                                            src={_img.url}
                                            alt={`Preview ${index}`}
                                            className="max-w-full max-h-[680px] object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`${images.length === 1 ? 'hidden' : 'flex'}`}>
                            {/* Left Arrow */}
                            <div
                                onClick={handlePrev}
                                className='top-1/2 left-4 z-50 absolute flex justify-center items-center bg-white hover:bg-mountain-50 rounded-full w-10 h-10 hover:scale-105 -translate-y-1/2 duration-300 ease-in-out cursor-pointer'
                            >
                                <FaChevronLeft />
                            </div>
                            {/* Right Arrow */}
                            <div
                                onClick={handleNext}
                                className={`top-1/2 right-4 z-50 absolute flex justify-center items-center bg-white hover:bg-mountain-50 rounded-full w-10 h-10 hover:scale-105 -translate-y-1/2 duration-300 ease-in-out cursor-pointer`}
                            >
                                <FaChevronRight />
                            </div>
                            {/* Gallery Navigating */}
                            <div
                                onClick={handleNext}
                                className='bottom-4 left-1/2 z-50 absolute flex justify-center items-center space-x-2 rounded-full -translate-x-1/2 -translate-y-1/2 duration-300 ease-in-out cursor-pointer transform'
                            >
                                <div className={`gap-2 flex`}>
                                    {images.map((_, index) => {
                                        let navIndex;
                                        switch (index) {
                                            case 0:
                                                navIndex = 3; // last image
                                                break;
                                            case 1:
                                                navIndex = 0; // first
                                                break;
                                            case 2:
                                                navIndex = 1; // second
                                                break;
                                            case 3:
                                                navIndex = 2; // third
                                                break;
                                            default:
                                                navIndex = index;
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className={`hover:bg-white hover:opacity-100 rounded-lg w-8 h-2 ${currentIndex === index
                                                    ? 'bg-white opacity-100'
                                                    : 'bg-mountain-200 opacity-50'
                                                    }`}
                                                onClick={() => handleNav(navIndex)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-between w-[35%] h-full'>
                        <div>
                            <div className='flex justify-between items-end p-4 border-mountain-100 border-b w-full h-28'>
                                <div className='flex justify-between items-center w-full'>
                                    <div className='flex items-center space-x-2'>
                                        <Avatar className='size-12'>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p className='font-medium'>Nguyễn Minh Thông</p>
                                    </div>
                                    <div className='flex'>
                                        <Button title='Download' onClick={handleDownload}>
                                            <FiDownload className='size-5' />
                                        </Button>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button className='flex w-4'>
                                                    <FiTrash2 className='size-5' />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="dark:bg-mountain-900 mt-2 mr-6 p-2 border-mountain-100 dark:border-mountain-700 w-48">
                                                <div className="flex flex-col space-y-2">
                                                    <p className='text-sm'>Are you sure to delete?</p>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button className='bg-mountain-100'>
                                                                <FiTrash2 className='mr-2 size-5' />
                                                                <p className='font-normal'>Delete This</p>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="flex justify-center sm:max-w-[320px] h-fit cursor-not-allowed" hideCloseButton>
                                                            <DialogHeader>
                                                                <DialogDescription className='flex justify-center items-center space-x-4'>
                                                                    <div className='relative flex justify-center items-center rounded-[8px] h-full'>
                                                                        <div className='relative mx-auto border-4 border-t-blue-600 border-blue-300 rounded-full w-10 h-10 animate-spin' />
                                                                    </div>
                                                                    <DialogTitle className='font-normal text-base text-center'>Deleting This Image</DialogTitle>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-2 px-4 py-2 border-mountain-100 border-b w-full h-1/2'>
                                <div className='flex justify-between items-center w-full'>
                                    <p className='font-medium'>Prompt</p>
                                    <Button title='Copy' className='bg-mountain-100'>
                                        <IoCopyOutline className='size-5' />
                                    </Button>
                                </div>
                                <div className='flex h-40 overflow-y-auto custom-scrollbar'>
                                    <AnyShowMoreText
                                        lines={3}
                                        more="Show more"
                                        less="Show less"
                                        className="text-sm break-words"
                                        anchorClass="cursor-pointer hover:text-indigo-400 block py-2 underline text-sm"
                                        expanded={false}
                                        truncatedEndingComponent={"... "}
                                    >
                                        {prompt}
                                    </AnyShowMoreText>
                                </div>
                            </div>
                            <div className='flex p-4 w-full'>
                                <div className='flex flex-col space-y-2 w-1/3'>
                                    <div className='flex items-center w-full'>
                                        <p className='font-medium'>Model</p>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <img src={example_1} className='rounded-xs w-5 h-5' />
                                        <p className='text-mountain-600 line-clamp-1'>Ultra Realism</p>
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-2 w-1/3'>
                                    <div className='flex items-center w-full'>
                                        <p className='font-medium'>Aspect Ratio</p>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <IoIosSquareOutline className='size-5' />
                                        <p className='text-mountain-600'>1:1</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between px-4 w-full'>
                                <div className='flex flex-col space-y-2 w-1/3'>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='font-medium'>Styles</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className='text-mountain-600'>Default</p>
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-2 w-1/3'>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='font-medium'>Lighting</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className='text-mountain-600'>Default</p>
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-2 w-1/3'>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='font-medium'>Camera</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className='text-mountain-600'>Default</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-2'>
                            <Button className='bg-indigo-200 shadow-sm border border-mountain-300 w-full h-12 font-normal'>
                                <RiFolderUploadLine className='mr-2 size-5' />
                                <p>Post My Media</p>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GenImage