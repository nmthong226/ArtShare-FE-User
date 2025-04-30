//Assets
import app_logo from "/logo_app_v_101.png";

//Icons
import { IoIosArrowBack } from "react-icons/io";
// import { HiOutlineCommandLine } from "react-icons/hi2";
import { MdOutlineExplore, MdOutlineLibraryBooks } from "react-icons/md";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { RiImageAiLine } from "react-icons/ri";

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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import DevNews from "./dev-news";

type SidebarProps = {
  expand: boolean,
  setExpand: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ expand, setExpand }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openPosts, setOpenPosts] = useState(true);
  const [openBlogs, setOpenBlogs] = useState(true);
  const [openAI, setOpenAI] = useState(true);

  useEffect(() => {
    if (!expand) {
      setOpenPosts(false);
      setOpenBlogs(false);
      setOpenAI(false);
    }
  }, [expand]);

  return (
    <aside className={`${expand ? 'w-60' : 'w-16'} h-screen transition-all ease-in-out duration-500  top-0 z-50 sticky xs:flex flex-col flex-shrink-0 flex-none justify-between space-y-4 bg-white dark:bg-mountain-950 py-4 border-r-1 border-r-mountain-100 dark:border-r-mountain-700 overflow-hidden`}>
      <div className="flex flex-col space-y-6">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-5">
          <div className={`flex items-center overflow-hidden ease-in-out transition-all duration-500 ${expand ? 'w-auto opacity-100' : 'opacity-0'}`}>
            <img src={app_logo} className="flex mr-2 rounded-sm w-6 h-6" />
            <p className="font-medium">ArtShare</p>
          </div>
          <div className="flex-grow" />
          <div
            onClick={() => setExpand(!expand)}
            className={`flex justify-center items-center hover:bg-gray-100 rounded-full w-6 h-6 hover:cursor-pointer max-pointer-events-none`}>
            {expand ? (
              <IoIosArrowBack className="size-4 text-gray-600" />
            ) : (
              <IoReorderThreeOutline className="size-6 text-gray-600" />
            )}
          </div>
        </div>
        {/* Sidebar Body */}
        <div className={`flex flex-col ${expand ? 'space-y-6' : 'space-y-2'} px-2 h-[calc(100vh-10rem)] overflow-x-hidden overflow-y-auto text-mountain-800 custom-scrollbar`}>
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
                  className={`${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 bg-white text-mountain-500'} group flex items-center px-4 rounded-md w-full h-10 hover:text-mountain-950 hover:cursor-pointer`}
                >
                  <Tooltip title={item.label} placement="right">
                    <item.icon className="flex-shrink-0 size-4" />
                  </Tooltip>
                  <div className={`overflow-hidden transition-all duration-500 origin-left ${expand ? 'ml-2 w-auto' : 'w-0'}`}>
                    <p className={`text-nowrap transition-opacity duration-500 ${expand ? 'opacity-100' : 'opacity-0'} font-medium text-sm`}>
                      {item.label}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="flex flex-col">
            <span className={`px-4 w-full text-mountain-600 text-xs ${!expand ? 'hidden' : 'line-clamp-1'} ease-in-out duration-500`}>My Content</span>
            <Collapsible
              open={expand ? openPosts : false}
              onOpenChange={(value) => expand && setOpenPosts(value)}
              className="flex flex-col w-full"
            >
              <CollapsibleTrigger asChild>
                <button className={`group flex px-4 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition `}>
                  <div className="flex items-center space-x-2">
                    <HiOutlineNewspaper className="size-4 shrink-0" />
                    <p className={`text-nowrap text-sm ${pathname === '/posts/new' || pathname === '/posts/manage' ? 'text-mountain-950' : 'text-mountain-500'} transition-opacity duration-500 ${expand ? 'opacity-100' : 'opacity-0'} font-medium text-sm`}>
                      Posts
                    </p>
                  </div>
                  <ChevronRight
                    className={`size-4 group-data-[state=open]:rotate-90 transition-transform duration-500 ${expand && 'hidden'}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-6 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {[
                  { label: 'Create Post', href: '/posts/new' },
                  { label: 'Manage Post', href: '#' },
                ].map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      to={item.href}
                      key={index}
                      className={`${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 bg-white text-mountain-500'} group flex pr-1.5 items-center rounded-md justify-between w-full h-8 hover:text-mountain-950 hover:cursor-pointer`}>
                      <div className="flex justify-center items-center transition-all duration-500">
                        <MdDragIndicator className={`invisible ${isActive && 'visible'} group-hover:visible size-4 text-mountain-400`} />
                        <p className={`flex text-nowrap transition-opacity duration-500 opacity-100 font-normal text-sm`}>{item.label}</p>
                      </div>
                      <div className={`${!isActive && 'hidden'} group-hover:flex w-[14px] h-[14px] text-mountain-400 hover:cursor-pointer`}>
                        <LuStarOff />
                      </div>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              open={expand ? openBlogs : false}
              onOpenChange={(value) => expand && setOpenBlogs(value)}
              className="flex flex-col w-full"
            >
              <CollapsibleTrigger asChild>
                <button className={`group flex px-4 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                  <div className="flex items-center space-x-2">
                    <MdOutlineLibraryBooks className="size-4" />
                    <p className={`text-nowrap text-sm ${pathname === '/blogs/new' || pathname === '/blogs/manage' ? 'text-mountain-950' : 'text-mountain-500'} transition-opacity duration-500 ${expand ? 'opacity-100' : 'opacity-0'} font-medium text-sm`}>
                      Blogs
                    </p>
                  </div>
                  <ChevronRight
                    className={`size-4 group-data-[state=open]:rotate-90 transition-transform duration-500 ${expand && 'hidden'}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-6 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {[
                  { label: 'Write Blog', href: '/blogs/new' },
                  { label: 'Manage Blog', href: '#' },
                ].map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      to={item.href}
                      key={index}
                      className={`${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 bg-white text-mountain-500'} group flex pr-1.5 items-center rounded-md justify-between w-full h-8 hover:text-mountain-950 hover:cursor-pointer`}>
                      <div className="flex justify-center items-center transition-all duration-500">
                        <MdDragIndicator className={`invisible ${isActive && 'visible'} group-hover:visible size-4 text-mountain-400`} />
                        <p className={`flex text-nowrap transition-opacity duration-500 opacity-100 font-normal text-sm`}>{item.label}</p>
                      </div>
                      <div className={`${!isActive && 'hidden'} group-hover:flex w-[14px] h-[14px] text-mountain-400 hover:cursor-pointer`}>
                        <LuStarOff />
                      </div>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="flex flex-col">
            <span className={`px-4 w-full text-mountain-600 text-xs ${!expand ? 'hidden' : 'line-clamp-1'} ease-in-out duration-500`}>My Workspace</span>
            <Collapsible
              open={expand ? openAI : false}
              onOpenChange={(value) => expand && setOpenAI(value)}
              className="flex flex-col w-full"
            >
              <CollapsibleTrigger asChild>
                <button className={`group flex px-4 text-mountain-500 justify-between items-center  hover:bg-gray-100 py-2 rounded-md w-full transition`}>
                  <div className="flex items-center space-x-2">
                    <RiImageAiLine className="size-4" />
                    <p className={`text-nowrap text-sm transition-opacity duration-500 ${expand ? 'opacity-100' : 'opacity-0'} font-medium text-sm`}>
                      Art Studio
                    </p>
                  </div>
                  <ChevronRight
                    className={`size-4 group-data-[state=open]:rotate-90 transition-transform duration-500 ${expand && 'hidden'}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-6 px-1 border-mountain-400 border-l-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {[
                  { label: 'Text To Image', href: '/image/tool/text-to-image' },
                  { label: 'Creative Upscale', href: '#' },
                  { label: 'Image Editor', href: '#' },
                ].map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      to={item.href}
                      key={index}
                      className={`${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 bg-white text-mountain-500'} group flex pr-1.5 items-center rounded-md justify-between w-full h-8 hover:text-mountain-950 hover:cursor-pointer`}>
                      <div className="flex justify-center items-center transition-all duration-500">
                        <MdDragIndicator className={`invisible ${isActive && 'visible'} group-hover:visible size-4 text-mountain-400`} />
                        <p className={`flex text-nowrap transition-opacity duration-500 opacity-100 font-normal text-sm`}>{item.label}</p>
                      </div>
                      <div className="hidden group-hover:flex w-[14px] h-[14px] text-mountain-400 hover:cursor-pointer">
                        <LuStarOff />
                      </div>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      {/* Sidebar Footer */}
      <div className="bottom-4 absolute flex px-2 border-mountain-200 border-t-1 w-full">
        <DevNews expand={expand} />
      </div>
    </aside >
  )
}

export default Sidebar