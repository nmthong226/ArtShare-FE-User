//Core
import React, { useState } from 'react';

//Icons
import { IoIosSquareOutline } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { RiFolderUploadLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";

//Libs
import Slider from "react-slick";

//Components
import { Button, ImageList, ImageListItem } from '@mui/material';
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

//Assets
import example_1 from "../assets/1.webp"

interface promptResultProps {
    prompt: string,
    images: string[],
}

const PromptResult: React.FC<promptResultProps> = ({ prompt, images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <div className='flex flex-col space-y-2'>
            <div className='flex justify-between items-center space-x-2 w-full'>
                <p className='line-clamp-1'><span className='font-sans font-medium'>Prompt</span>{prompt}</p>
                <div className='flex items-center space-x-2'>
                    <Button className='flex bg-mountain-100 w-8' title='Post Media'>
                        <RiFolderUploadLine className='size-5' />
                    </Button>
                    <Button className='flex bg-mountain-100 w-8' title='Download'>
                        <FiDownload className='size-5' />
                    </Button>
                    <Button className='flex bg-mountain-100 w-4'>
                        <FiTrash2 className='size-5 text-red-900' />
                    </Button>
                </div>
            </div>
            <ImageList cols={4} gap={8} sx={{ width: '100%' }}>
                {images.map((img, index) => (
                    <ImageListItem key={index}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <img
                                    src={img}
                                    alt={`Image ${index + 1}`}
                                    loading="lazy"
                                    className='shadow-md cursor-pointer'
                                    style={{ borderRadius: '8px' }}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            </DialogTrigger>
                            <DialogContent className='p-0 border-0 rounded-xl min-w-7xl'>
                                <DialogHeader hidden>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogDescription>Image Description</DialogDescription>
                                </DialogHeader>
                                <div className='relative flex h-[680px]'>
                                    <div className='relative bg-mountain-100 rounded-l-xl w-[65%] h-[680px] overflow-hidden'>
                                        {/* Left Arrow */}
                                        <div
                                            onClick={handlePrev}
                                            className='top-1/2 left-4 z-50 absolute flex justify-center items-center bg-white hover:bg-mountain-50 rounded-full w-10 h-10 hover:scale-105 -translate-y-1/2 duration-300 ease-in-out cursor-pointer'
                                        >
                                            <FaChevronLeft />
                                        </div>
                                        {/* Image Slider */}
                                        <Slider {...settings}>
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
                                                                src={_img}
                                                                alt={`Preview ${index}`}
                                                                className="max-w-full max-h-[680px] object-contain"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Slider>
                                        {/* Right Arrow */}
                                        <div
                                            onClick={handleNext}
                                            className='top-1/2 right-4 z-50 absolute flex justify-center items-center bg-white hover:bg-mountain-50 rounded-full w-10 h-10 hover:scale-105 -translate-y-1/2 duration-300 ease-in-out cursor-pointer'
                                        >
                                            <FaChevronRight />
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
                                                        <Button title='Download'>
                                                            <FiDownload className='size-5' />
                                                        </Button>
                                                        <Button title='Delete'>
                                                            <FiTrash2 className='size-5' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col space-y-2 p-4 w-full'>
                                                <div className='flex justify-between items-center w-full'>
                                                    <p className='font-medium'>Prompt</p>
                                                    <Button title='Copy' className='bg-mountain-100'>
                                                        <IoCopyOutline className='size-5' />
                                                    </Button>
                                                </div>
                                                <p className='text-sm line-clamp-2'>{prompt}</p>
                                            </div>
                                            <div className='flex space-x-10 p-4 w-full'>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <p className='font-medium'>Model</p>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <img src={example_1} className='rounded-xs w-5 h-5' />
                                                        <p className='text-mountain-600'>Ultra Realism</p>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <p className='font-medium'>Aspect Ratio</p>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <IoIosSquareOutline className='size-5' />
                                                        <p className='text-mountain-600'>1:1</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex space-x-10 p-4 w-full'>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <p className='font-medium'>Styles</p>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <p className='text-mountain-600'>Default</p>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <p className='font-medium'>Lighting</p>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <p className='text-mountain-600'>Default</p>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <p className='font-medium'>Camera</p>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
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
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    )
}

export default PromptResult