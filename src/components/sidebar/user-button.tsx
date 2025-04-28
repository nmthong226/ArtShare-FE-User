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
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//Icons
import { IoSunnyOutline } from "react-icons/io5";
import { BsChevronExpand } from "react-icons/bs";
import { IoMoonOutline } from "react-icons/io5";
import { AiOutlineDesktop } from "react-icons/ai";

import { useNavigate } from 'react-router-dom';

const UserButton: React.FC = ({ }) => {
    // const user = useStore((state) => state.user);

    const navigate = useNavigate();

    const handleLogout = () => {
        // useStore.getState().clearUser();
        navigate("/auth/login");
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='flex items-center w-full h-full'>
                <div className={`flex items-center justify-between space-x-2 hover:bg-gray-100 px-2 rounded-lg w-full h-12`}>
                    <div className='flex items-center space-x-2'>
                        <Avatar className="size-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className={`transition-all duration-300 origin-left opacity-100 scale-x-100 line-clamp-1 font-medium text-sm`}>
                            Nguyễn Minh Thông
                        </p>
                    </div>
                    <BsChevronExpand />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" >
                <DropdownMenuLabel className="flex flex-col space-y-1">
                    <p>Nguyễn Minh Thông</p>
                    <p className="font-normal text-gray-600 text-xs">nmthong226@gmail.com</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Billing</span>
                        <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Command Menu</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex justify-between">
                        <span>Themes</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex justify-between items-center px-1 py-1 border border-gray-400 rounded-sm w-20 text-xs hover:cursor-pointer">
                                <div className="flex items-center space-x-1">
                                    <IoSunnyOutline />
                                    <p>Light</p>
                                </div>
                                <BsChevronExpand className="size-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top">
                                <DropdownMenuItem>
                                    <div className="flex items-center space-x-2">
                                        <IoSunnyOutline className="size-4" />
                                        <p>Light</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex items-center space-x-2">
                                        <IoMoonOutline className="size-4" />
                                        <p>Dark</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex items-center space-x-2">
                                        <AiOutlineDesktop className="size-4" />
                                        <p>System</p>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton