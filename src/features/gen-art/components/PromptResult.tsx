//Core
import React, { useEffect, useState } from 'react';

//Icons
import { FiDownload } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

//Components
import { Button, CircularProgress, ImageList, ImageListItem } from '@mui/material';
import GenImage from './GenImage';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface promptResultProps {
    prompt: string,
    images: string[],
    generating: boolean | null,
    progress?: number[] | null,
    index?: number;
    resultId?: number;
    onDelete?: (index: number) => void;
    onDeleteSingle?: (resultId: number, imageIndex: number) => void;
}

const PromptResult: React.FC<promptResultProps> = ({ prompt, images, generating, resultId, progress, index, onDelete, onDeleteSingle }) => {
    const [open, setOpen] = useState(false);

    const handleDownloadAll = async () => {
        const zip = new JSZip();
        await Promise.all(
            images.map(async (url, index) => {
                const response = await fetch(url);
                const blob = await response.blob();
                zip.file(`image-${index + 1}.jpg`, blob);
            })
        );

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'images.zip');
    };


    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (open) {
            timeout = setTimeout(() => {
                onDelete?.(index!); // Trigger delete
                setOpen(false); // Close dialog after delete
            }, 2000);
        }

        return () => clearTimeout(timeout);
    }, [open]);

    if (generating === false) {
        return (
            <div className='flex flex-col space-y-2 w-full'>
                <div className='flex justify-between items-center space-x-2 w-full'>
                    <p className='line-clamp-1'><span className='mr-2 font-sans font-medium'>Prompt</span>{prompt}</p>
                    <div className='flex items-center space-x-2'>
                        <Button title='Download All' className='bg-mountain-100' onClick={handleDownloadAll}>
                            <FiDownload className='size-5' />
                        </Button>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button className='flex bg-mountain-100 w-4'>
                                    <FiTrash2 className='size-5 text-red-900' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="dark:bg-mountain-900 mt-2 mr-6 p-2 border-mountain-100 dark:border-mountain-700 w-48">
                                <div className="flex flex-col space-y-2">
                                    <p className='text-sm'>Are you sure to delete?</p>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className='bg-mountain-100'>
                                                <FiTrash2 className='mr-2 size-5' />
                                                <p className='font-normal'>Delete All</p>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="flex justify-center sm:max-w-[320px] h-fit cursor-not-allowed" hideCloseButton>
                                            <DialogHeader>
                                                <DialogDescription className='flex justify-center items-center space-x-4'>
                                                    <CircularProgress size={32} thickness={4} />
                                                    <DialogTitle className='font-normal text-base text-center'>Deleting These Images</DialogTitle>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <ImageList cols={4} gap={8} sx={{ width: '100%', minHeight: '268px' }}>
                    {images.map((img, index) => (
                        <ImageListItem key={index} className='flex h-full object-cover'>
                            <GenImage
                                image={img}
                                imageId={index}
                                images={images}
                                prompt={prompt}
                                index={index}
                                onDelete={onDeleteSingle!}
                                resultId={resultId!} />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
        )
    }
    return (
        <>
            {generating && (
                <div className='flex flex-col space-y-2 w-full'>
                    <div className='flex justify-between items-center space-x-2 w-full'>
                        <p className='line-clamp-1'><span className='font-sans font-medium'>Prompt</span>{prompt}</p>
                        <div className='flex items-center space-x-2'>
                            <Button className='flex bg-mountain-100 w-8' title='Download'>
                                <FiDownload className='size-5' />
                            </Button>
                            <Button className='flex bg-mountain-100 w-4'>
                                <FiTrash2 className='size-5 text-red-900' />
                            </Button>
                        </div>
                    </div>
                    <ImageList cols={4} gap={8} sx={{ width: '100%', minHeight: '268px' }}>
                        {images.map((img, imgIndex) => (
                            <ImageListItem key={index} className='flex h-full object-cover'>
                                {progress && progress[imgIndex] === 100 ? (
                                    <GenImage
                                        image={img}
                                        imageId={index!}
                                        images={images}
                                        prompt={prompt}
                                        index={imgIndex}
                                        resultId={resultId!} />
                                ) : (
                                    <div className='relative flex justify-center items-center bg-mountain-100 rounded-[8px] h-full'>
                                        <CircularProgress size={64} thickness={4} />
                                        <p className='absolute font-medium text-gray-700 text-sm'>...Loading</p>
                                    </div>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            )}
        </>
    )
}

export default PromptResult