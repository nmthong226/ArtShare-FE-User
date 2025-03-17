import React from 'react'
import { IoReorderThreeOutline } from "react-icons/io5";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import app_logo from '/logo_app_bg.jpg';
import { RiShoppingBag4Line, RiShoppingBag4Fill } from "react-icons/ri";
import { Input } from '@/components/ui/input';
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { Button } from '@/components/ui/button';
import { IoMdMore } from "react-icons/io";
import { PiSignInLight } from "react-icons/pi";
import { BsPen } from "react-icons/bs";
import { RiFolderUploadLine } from "react-icons/ri";
import { RiImageAiLine } from "react-icons/ri";
import { BsFilePerson } from "react-icons/bs";
import { MdLibraryBooks, MdOutlineLibraryBooks } from "react-icons/md";

const InAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col w-full h-full'>
            <nav className='flex justify-between items-center bg-mountain-white border-b-1 border-b-mountain-100 w-full h-16'>
                <div className='flex items-center h-full'>
                    <div className='flex justify-center items-center w-16 h-16'>
                        <IoReorderThreeOutline className='w-6 h-6' />
                    </div>
                    <div className='flex items-center space-x-4 h-full'>
                        <div className='flex items-center space-x-2 pr-4 border-r-1 border-r-mountain-300'>
                            <img src={app_logo} className='rounded-sm w-8 h-8' />
                            <p className='font-semibold'>Art Share</p>
                        </div>
                        <div className='group flex items-center border-mountain-300 border-b-4 h-full'>
                            <div className='flex items-center space-x-2 hover:bg-mountain-100 mt-1 p-2 rounded-lg hover:cursor-pointer'>
                                <MdExplore className='w-6 h-6' />
                                <p className='font-bold text-sm'>Explore</p>
                            </div>
                        </div>
                        <div className='flex items-center border-white border-b-4 h-full'>
                            <div className='flex items-center space-x-2 hover:bg-mountain-100 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 hover:cursor-pointer'>
                                <MdOutlineLibraryBooks className='w-6 h-6' />
                                <p className='text-sm'>Blogs</p>
                            </div>
                        </div>
                        <div className='flex items-center border-white border-b-4 h-full'>
                            <div className='flex items-center space-x-2 hover:bg-mountain-100 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 hover:cursor-pointer'>
                                <RiShoppingBag4Line className='w-6 h-6' />
                                <p className='text-sm'>Shop</p>
                            </div>
                        </div>
                        <div className='relative flex items-center bg-mountain-50 rounded-2xl w-96 h-10 text-mountain-500 focus-within:text-mountain-950'>
                            <FiSearch className='left-2 absolute w-5 h-5' />
                            <Input className='shadow-inner pr-8 pl-8 border-1 rounded-2xl' placeholder="Search" />
                            <TiDeleteOutline className='right-2 absolute w-5 h-5' />
                        </div>
                    </div>
                </div>
                <div className='flex items-center space-x-4 h-full'>
                    <Button className='items-center rounded-2xl w-26'>
                        <PiSignInLight />
                        <p>Login</p>
                    </Button>
                    <Button className='rounded-2xl w-26 text-muted-foreground' variant={"outline"}>
                        <BsPen />
                        <p>Sign Up</p>
                    </Button>
                    <Button variant={"ghost"} title='More'><IoMdMore className='w-6 h-6' /></Button>
                </div>
            </nav>
            <div className='flex w-full h-full'>
                <aside className='flex flex-col space-y-4 bg-white border-r-1 border-r-mountain-100 w-16 h-full'>
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