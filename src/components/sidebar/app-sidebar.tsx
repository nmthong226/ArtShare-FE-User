//Assets
import app_logo from "/logo_app_v_101.png";

//Icons
import { IoIosArrowBack } from "react-icons/io";
// import { HiOutlineCommandLine } from "react-icons/hi2";
import { MdOutlineExplore, MdOutlineLibraryBooks } from "react-icons/md";
import { HiOutlineNewspaper } from "react-icons/hi2";

//Components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { MdDragIndicator } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import { LuStarOff } from "react-icons/lu";
// import UserButton from "./user-button";
import { Link, useLocation } from "react-router-dom";


const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <aside className="hidden top-0 z-50 sticky xs:flex flex-col flex-shrink-0 flex-none justify-between space-y-4 bg-white dark:bg-mountain-950 py-4 border-r-1 border-r-mountain-100 dark:border-r-mountain-700 w-60 h-[calc(100vh)]">
      <div className="flex flex-col space-y-6">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <img src={app_logo} className="flex rounded-sm w-6 h-6" />
            <p className="font-medium">ArtShare</p>
          </div>
          <div className="flex justify-center items-center hover:bg-mountain-100 rounded-full w-6 h-6">
            <IoIosArrowBack className="size-4" />
          </div>
        </div>
        {/* Sidebar Body */}
        <div className="flex flex-col space-y-6 px-2 h-[calc(100vh)] overflow-y-auto text-mountain-800 custom-scrollbar">
          {/* 
          <div className="flex flex-col">
          <span className="px-4 w-full text-mountain-600 text-xs">Platform</span>
          <Collapsible className="flex flex-col px-2 w-full" defaultOpen>
            <CollapsibleTrigger asChild>
              <button className={`group flex px-2 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                <div className="flex items-center space-x-2">
                  <MdOutlineExplore className="size-4" />
                  <p className="text-sm">Explore Art</p>
                </div>
                <ChevronRight
                  className="size-4 group-data-[state=open]:rotate-90 transition-transform duration-300"
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                <div className="flex justify-center items-center">
                  <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                  <p className={`hidden xl:flex text-sm`}>Community</p>
                </div>
                <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                  <LuStarOff />
                </div>
              </div>
              <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                <div className="flex justify-center items-center">
                  <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                  <p className={`hidden xl:flex text-sm`}>Trending</p>
                </div>
                <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                  <LuStarOff />
                </div>
              </div>
              <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                <div className="flex justify-center items-center">
                  <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                  <p className={`hidden xl:flex text-sm`}>Latest</p>
                </div>
                <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                  <LuStarOff />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="flex flex-col px-2 w-full" defaultOpen>
            <CollapsibleTrigger asChild>
              <button className={`group flex px-2 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                <div className="flex items-center space-x-2">
                  <MdOutlineLibraryBooks className="size-4" />
                  <p className="text-sm">Blogs</p>
                </div>
                <ChevronRight
                  className="size-4 group-data-[state=open]:rotate-90 transition-transform duration-300"
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                <div className="flex justify-center items-center">
                  <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                  <p className={`hidden xl:flex text-sm`}>History</p>
                </div>
                <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                  <LuStarOff />
                </div>
              </div>
              <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                <div className="flex justify-center items-center">
                  <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                  <p className={`hidden xl:flex text-sm`}>Starred</p>
                </div>
                <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                  <LuStarOff />
                </div>
              </div>
              <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                <div className="flex justify-center items-center">
                  <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                  <p className={`hidden xl:flex text-sm`}>Settings</p>
                </div>
                <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                  <LuStarOff />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          </div> 
          */}
          <div className="flex flex-col justify-between items-center space-y-1 w-full">
            {[
              { icon: MdOutlineExplore, label: 'Explore Arts', href: '/explore' },
              { icon: MdOutlineLibraryBooks, label: 'Read Blogs', href: '/blogs' },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  to={item.href}
                  key={item.label}
                  className={`${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 bg-white text-gray-500'} group flex items-center  px-2 rounded-md w-full h-10 hover:text-black hover:cursor-pointer`}
                >
                  <item.icon className="flex-shrink-0 size-4" />
                  <div
                    className={`overflow-hidden transition-all duration-300 origin-left ml-2 w-auto`}
                  >
                    <p
                      className={`text-nowrap transition-opacity duration-300 opacity-100 font-medium text-sm`}
                    >
                      {item.label}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="flex flex-col">
            <span className="px-2 w-full text-mountain-600 text-xs">User Upload</span>
            <Collapsible className="flex flex-col w-full" defaultOpen>
              <CollapsibleTrigger asChild>
                <button className={`group flex px-2 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                  <div className="flex items-center space-x-2">
                    <HiOutlineNewspaper className="size-4" />
                    <p className="text-sm">Posts</p>
                  </div>
                  <ChevronRight
                    className="size-4 group-data-[state=open]:rotate-90 transition-transform duration-300"
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Create Post</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Manage Post</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="flex flex-col w-full" defaultOpen>
              <CollapsibleTrigger asChild>
                <button className={`group flex px-2 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                  <div className="flex items-center space-x-2">
                    <MdOutlineLibraryBooks className="size-4" />
                    <p className="text-sm">Blogs</p>
                  </div>
                  <ChevronRight
                    className="size-4 group-data-[state=open]:rotate-90 transition-transform duration-300"
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Create Blog</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Manage Blog</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="flex flex-col">
            <span className="px-2 w-full text-mountain-600 text-xs">AI Workspace </span>
            <Collapsible className="flex flex-col w-full" defaultOpen>
              <CollapsibleTrigger asChild>
                <button className={`group flex px-2 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                  <div className="flex items-center space-x-2">
                    <HiOutlineNewspaper className="size-4" />
                    <p className="text-sm">Art Studio</p>
                  </div>
                  <ChevronRight
                    className="size-4 group-data-[state=open]:rotate-90 transition-transform duration-300"
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Text To Image</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Creative Upscale</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Image Editor</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
                <div className={`group justify-between flex  items-center hover:bg-gray-100 pr-2 rounded-md w-full h-8 hover:cursor-pointer`}>
                  <div className="flex justify-center items-center">
                    <MdDragIndicator className="invisible group-hover:visible size-4 text-gray-400" />
                    <p className={`hidden xl:flex text-sm`}>Subscriptions</p>
                  </div>
                  <div className="hidden group-hover:flex w-[14px] h-[14px] text-gray-400 hover:cursor-pointer">
                    <LuStarOff />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      {/* Sidebar Footer */}
      {/* <div className="flex px-2 w-full">
        <UserButton />
      </div> */}
    </aside>
  )
}

export default Sidebar