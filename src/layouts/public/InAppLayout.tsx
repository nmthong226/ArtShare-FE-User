// Core Lib/Frameworks
import React from 'react'

// Assets
import app_logo from '/logo_app_bg.jpg';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


// Icons
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { IoReorderThreeOutline } from "react-icons/io5";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { RiShoppingBag4Line, RiShoppingBag4Fill } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { PiSignInLight } from "react-icons/pi";
import { BsPen } from "react-icons/bs";
import { RiFolderUploadLine } from "react-icons/ri";
import { RiImageAiLine } from "react-icons/ri";
import { BsFilePerson } from "react-icons/bs";
import { MdLibraryBooks, MdOutlineLibraryBooks } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import UserInAppConfigs from '@/components/popovers/UserInAppConfigs';


const InAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col w-full h-full'>
            <nav className='flex justify-between items-center bg-white dark:bg-mountain-950 pr-2 border-b-1 border-b-mountain-100 dark:border-b-mountain-700 w-full h-16'>
                <div className='flex items-center h-full'>
                    <Sheet>
                        <SheetTrigger>
                            <div className='sm:hidden flex justify-center items-center w-16 h-16'>
                                <IoReorderThreeOutline className='w-6 h-6' />
                            </div>
                        </SheetTrigger>
                        <SheetContent side={"left"} className='xs:hidden flex w-1/2'>
                            <SheetHeader>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                    <div className='hidden sm:flex justify-center items-center w-16 h-16'>
                        <IoReorderThreeOutline className='w-6 h-6' />
                    </div>
                    <div className='flex items-center space-x-1 lg:space-x-2 xl:space-x-4 h-full'>
                        <div className='flex items-center space-x-1 lg:space-x-2 pr-4 border-r-mountain-300 md:border-r-1 dark:border-r-mountain-700 text-nowrap'>
                            <img src={app_logo} className='rounded-sm w-8 h-8' />
                            <p className='font-semibold'>Art Share</p>
                        </div>
                        <div className='group flex items-center border-mountain-300 border-b-4 h-full'>
                            <div className='hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:cursor-pointer'>
                                <MdExplore className='w-6 h-6' />
                                <p className='font-bold text-sm'>Explore</p>
                            </div>
                        </div>
                        <div className='flex items-center border-white dark:border-mountain-950 border-b-4 h-full'>
                            <div className='hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer'>
                                <MdOutlineLibraryBooks className='w-6 h-6' />
                                <p className='text-sm'>Blogs</p>
                            </div>
                        </div>
                        <div className='flex items-center border-white dark:border-mountain-950 border-b-4 h-full'>
                            <div className='hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer'>
                                <RiShoppingBag4Line className='w-6 h-6' />
                                <p className='text-sm'>Shop</p>
                            </div>
                        </div>
                        <div className='hidden relative lg:flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl lg:w-72 xl:w-96 h-10 text-mountain-500 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-mountain-400'>
                            <FiSearch className='left-2 absolute w-5 h-5' />
                            <Input className='shadow-inner pr-8 pl-8 border-1 rounded-2xl' placeholder="Search" />
                            <TiDeleteOutline className='right-2 absolute w-5 h-5' />
                        </div>
                        <div className='lg:hidden flex items-center border-white dark:border-mountain-950 border-b-4 h-full'>
                            <div className='hidden md:flex items-center space-x-1:lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer lg'>
                                <FiSearch className='w-6 h-6' />
                                <p className='text-sm'>Search</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center space-x-2 xl:space-x-4 h-full'>
                    <UserInAppConfigs />
                    <Button className='items-center bg-mountain-800 dark:bg-mountain-200 rounded-2xl w-20 xl:w-26'>
                        <FiLogIn />
                        <p>Login</p>
                    </Button>
                    <Button className='hidden xs:flex rounded-2xl w-20 xl:w-26 text-muted-foreground' variant={"outline"}>
                        <BsPen />
                        <p>Sign Up</p>
                    </Button>
                </div>
            </nav>
            <div className='flex w-full h-full'>
                <aside className='hidden xs:flex flex-col space-y-4 bg-white dark:bg-mountain-950 py-4 border-r-1 border-r-mountain-100 dark:border-r-mountain-700 w-16 h-full'>
                    <div className='md:hidden flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <MdExplore className='w-6 h-6' />
                        <p className='font-bold text-[10px]'>Explore</p>
                    </div>
                    <div className='md:hidden flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <MdOutlineLibraryBooks className='w-6 h-6' />
                        <p className='text-[10px]'>Blogs</p>
                    </div>
                    <div className='md:hidden flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <RiShoppingBag4Line className='w-6 h-6' />
                        <p className='text-[10px]'>Shop</p>
                    </div>
                    <div className='md:hidden flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <FiSearch className='w-6 h-6' />
                        <p className='text-[10px]'>Search</p>
                    </div>
                    <hr className='md:hidden flex border-mountain-700 border-t-1 w-full h-1' />
                    <div className='flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <RiFolderUploadLine className='w-6 h-6' />
                        <p className='text-[10px]'>Upload</p>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <RiImageAiLine className='w-6 h-6' />
                        <p className='text-[10px]'>Create</p>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-2 w-full h-16'>
                        <BsFilePerson className='w-6 h-6' />
                        <p className='text-[10px]'>Portfolio</p>
                    </div>
                </aside>
                {children}
            </div>
        </div>
    )
}

export default InAppLayout