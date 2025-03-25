// Core Lib/Frameworks
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Assets
import app_logo from '/logo_app_v_101.png';

// Context
import { useUser } from "@/context/UserProvider";

// Components
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserInAppConfigs from "@/components/popovers/UserInAppConfigs";
import { Skeleton } from "@/components/ui/skeleton"

// Icons
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import {
  IoMail,
  IoNotifications,
  IoReorderThreeOutline,
} from "react-icons/io5";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import {
  RiShoppingBag4Line,
  RiShoppingBag4Fill,
  RiFolderUploadFill,
  RiImageAiFill,
} from "react-icons/ri";
import { BsFilePersonFill, BsPen } from "react-icons/bs";
import { RiFolderUploadLine } from "react-icons/ri";
import { RiImageAiLine } from "react-icons/ri";
import { BsFilePerson } from "react-icons/bs";
import { MdLibraryBooks, MdOutlineLibraryBooks } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import ProtectedSidebarItem from "@/components/ProtectedItems/ProtectedSidebarItem";

const UserFunctionality: React.FC<{ user?: User | null; loading?: boolean }> = ({ user, loading }) => {
  const location = useLocation();

  // Show a loading indicator while checking authentication
  if (loading) {
    return (
      <>
        <Skeleton
          className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"
        >
        </Skeleton>
        <Skeleton
          className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"
        >
        </Skeleton>
      </>
    )
  }

  // Show Sign Up and Login for non-logged-in users
  if (!user || Object.keys(user).length === 0) {
    return (
      <>
        <Link
          to="/signup"
          className="hidden xs:flex justify-center items-center space-x-2 border border-mountain-700 rounded-2xl w-24 xl:w-26 h-9 text-muted-foreground text-sm"
        >
          <BsPen />
          <p>Sign Up</p>
        </Link>
        <Link
          to="/login"
          className="flex justify-center items-center space-x-2 bg-mountain-700 hover:bg-mountain-600 dark:bg-mountain-200 rounded-2xl w-20 xl:w-26 h-9 text-mountain-100 dark:text-mountain-950 text-sm"
        >
          <FiLogIn />
          <p>Login</p>
        </Link>
      </>
    );
  }

  // Show Messages and Updates for logged-in users
  return (
    <>
      <Link
        to="/messages"
        className={`hidden xs:flex group items-center border-b-4 h-full ${location.pathname === "/messages"
          ? "border-indigo-300 dark:text-mountain-50 text-mountain-950"
          : "dark:border-mountain-950 border-white dark:text-mountain-500 text-mountain-700"
          }`}
      >
        <div className="flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
          {location.pathname === "/messages" ? (
            <IoMail className="w-6 h-6" />
          ) : (
            <IoMailOutline className="w-6 h-6" />
          )}
          <p className="text-sm">Messages</p>
        </div>
      </Link>
      <Link
        to="/updates"
        className={`hidden xs:flex group items-center border-b-4 h-full ${location.pathname === "/updates"
          ? "border-indigo-300 dark:text-mountain-50 text-mountain-950"
          : "dark:border-mountain-950 border-white dark:text-mountain-500 text-mountain-700"
          }`}
      >
        <div className="flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
          {location.pathname === "/updates" ? (
            <IoNotifications className="w-6 h-6" />
          ) : (
            <IoNotificationsOutline className="w-6 h-6" />
          )}
          <p className="text-sm">Updates</p>
        </div>
      </Link>
    </>
  );
};



const InAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useUser();
  return (
    <div className="flex flex-col w-full h-full">
      <nav className="flex justify-between items-center bg-white dark:bg-mountain-950 pr-2 lg:pr-4 border-b-1 border-b-mountain-100 dark:border-b-mountain-700 w-full h-16">
        <div className="flex items-center h-full">
          <Sheet>
            <SheetTrigger>
              <div className="sm:hidden flex justify-center items-center w-16 h-16">
                <IoReorderThreeOutline className="w-6 h-6" />
              </div>
            </SheetTrigger>
            <SheetContent
              side={"left"}
              className="xs:hidden flex bg-mountain-50 dark:bg-mountain-950 w-2/3"
            >
              <SheetHeader>
                <SheetTitle>
                  <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-2 lg:space-x-2 pr-4 border-r-mountain-300 md:border-r-1 dark:border-r-mountain-700 w-full text-nowrap">
                      <img src={app_logo} className="rounded-sm w-8 h-8" />
                      <p className="font-semibold">Art Share</p>
                    </div>
                    <Link
                      to="/signup"
                      className="flex justify-center items-center space-x-2 border border-mountain-600 rounded-2xl w-40 h-9 text-muted-foreground text-sm"
                    >
                      <BsPen />
                      <p>Sign Up</p>
                    </Link>
                  </div>
                </SheetTitle>
                <SheetDescription asChild>
                  <div>
                    <hr className="my-2 border-mountain-200 dark:border-mountain-600 border-t-1 w-full" />
                  </div>
                </SheetDescription>
                <div className="flex flex-col space-y-4 w-full h-full">
                  <div className="flex items-center space-x-2 lg:space-x-2 bg-mountain-100 hover:bg-mountain-200 dark:bg-mountain-1000 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-950 dark:text-mountain-50 hover:cursor-pointer">
                    <MdExplore className="w-6 h-6" />
                    <p className="font-bold text-sm">Explore</p>
                  </div>
                  <div className="flex items-center space-x-2 lg:space-x-2 hover:bg-mountain-200 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-600 dark:text-mountain-50 hover:cursor-pointer">
                    <MdOutlineLibraryBooks className="w-6 h-6" />
                    <p className="text-sm">Blogs</p>
                  </div>
                  <div className="flex items-center space-x-2 lg:space-x-2 hover:bg-mountain-200 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-600 dark:text-mountain-50 hover:cursor-pointer">
                    <RiShoppingBag4Line className="w-6 h-6" />
                    <p className="text-sm">Shop</p>
                  </div>
                  <div className="flex items-center space-x-2 lg:space-x-2 hover:bg-mountain-200 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-600 dark:text-mountain-50 hover:cursor-pointer">
                    <FiSearch className="w-6 h-6" />
                    <p className="text-sm">Search</p>
                  </div>
                  <hr className="my-2 border-mountain-600 border-t-1 w-full" />
                  <div className="flex items-center space-x-2 lg:space-x-2 hover:bg-mountain-200 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-600 dark:text-mountain-50 hover:cursor-pointer">
                    <RiFolderUploadLine className="w-6 h-6" />
                    <p className="text-sm">Submit</p>
                  </div>
                  <div className="flex items-center space-x-2 lg:space-x-2 hover:bg-mountain-200 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-600 dark:text-mountain-50 hover:cursor-pointer">
                    <RiImageAiLine className="w-6 h-6" />
                    <p className="text-sm">Create</p>
                  </div>
                  <div className="flex items-center space-x-2 lg:space-x-2 hover:bg-mountain-200 dark:hover:bg-mountain-1000 p-2 rounded-lg w-full text-mountain-600 dark:text-mountain-50 hover:cursor-pointer">
                    <BsFilePerson className="w-6 h-6" />
                    <p className="text-sm">Portfolio</p>
                  </div>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <div className="hidden sm:flex justify-center items-center w-16 h-16">
            <IoReorderThreeOutline className="w-6 h-6" />
          </div>
          <div className="flex items-center space-x-1 lg:space-x-2 xl:space-x-4 h-full">
            <div className="flex items-center space-x-1 lg:space-x-2 pr-4 border-r-mountain-300 md:border-r-1 dark:border-r-mountain-700 text-nowrap">
              <img src={app_logo} className="rounded-sm w-8 h-8" />
              <p className="font-semibold">Art Share</p>
            </div>
            <Link
              to="/explore"
              className={`group flex items-center border-b-4 h-full ${location.pathname === "/explore"
                ? "border-indigo-300 dark:text-mountain-50 text-mountain-950"
                : "dark:border-mountain-950 border-white dark:text-mountain-500 text-mountain-700"
                }`}
            >
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg dark:hover:text-mountain-50 hover:cursor-pointer">
                {location.pathname === "/explore" ? (
                  <MdExplore className="w-6 h-6" />
                ) : (
                  <MdOutlineExplore className="w-6 h-6" />
                )}
                <p className="text-sm">Explore</p>
              </div>
            </Link>
            <Link
              to="/blogs"
              className={`group flex items-center border-b-4 h-full ${location.pathname === "/blogs"
                ? "border-indigo-300 dark:text-mountain-50 text-mountain-950"
                : "dark:border-mountain-950 border-white dark:text-mountain-500 text-mountain-700"
                }`}
            >
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
                {location.pathname === "/blogs" ? (
                  <MdLibraryBooks className="w-6 h-6" />
                ) : (
                  <MdOutlineLibraryBooks className="w-6 h-6" />
                )}
                <p className="text-sm">Blogs</p>
              </div>
            </Link>
            <Link
              to="/shop"
              className={`group flex items-center border-b-4 h-full ${location.pathname === "/shop"
                ? "border-indigo-300 dark:text-mountain-50 text-mountain-950"
                : "dark:border-mountain-950 border-white dark:text-mountain-500 text-mountain-700"
                }`}
            >
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
                {location.pathname === "/shop" ? (
                  <RiShoppingBag4Fill className="w-6 h-6" />
                ) : (
                  <RiShoppingBag4Line className="w-6 h-6" />
                )}
                <p className="text-sm">Shop</p>
              </div>
            </Link>
            <div className="hidden relative lg:flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl lg:w-72 xl:w-96 h-10 text-mountain-500 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-mountain-400">
              <FiSearch className="left-2 absolute w-5 h-5" />
              <Input
                className="shadow-inner pr-8 pl-8 border-1 rounded-2xl"
                placeholder="Search"
              />
              <TiDeleteOutline className="right-2 absolute w-5 h-5" />
            </div>
            <div className="lg:hidden flex items-center border-white dark:border-mountain-950 border-b-4 h-full">
              <div className="hidden md:flex items-center space-x-1:lg:space-x-2 hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg text-mountain-500 hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer lg">
                <FiSearch className="w-6 h-6" />
                <p className="text-sm">Search</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center space-x-2 md:space-x-2 xl:space-x-4 h-full`}
        >
          <UserFunctionality user={user!} loading={loading!} />
          <UserInAppConfigs />
        </div>
      </nav>
      <div className="flex w-full h-full">
        <aside className="hidden xs:flex flex-col space-y-4 bg-white dark:bg-mountain-950 py-4 border-r-1 border-r-mountain-100 dark:border-r-mountain-700 w-16 h-full">
          {/* Explore */}
          <Link
            to="/explore"
            className="group md:hidden flex flex-col justify-center items-center w-full h-16 hover:cursor-pointer"
          >
            <div
              className={`flex justify-center items-center dark:group-hover:bg-mountain-800 group-hover:bg-mountain-100 dark:group-hover:text-mountain-50 group-hover:text-mountain-950 rounded-lg w-[80%] h-8 ${location.pathname === "/explore"
                ? "bg-mountain-100 dark:bg-mountain-800"
                : "text-mountain-600"
                }`}
            >
              {location.pathname === "/explore" ? (
                <MdExplore className="w-6 h-6" />
              ) : (
                <MdOutlineExplore className="w-6 h-6" />
              )}
            </div>
            <p className="text-[10px]">Explore</p>
          </Link>
          {/* Blogs */}
          <Link
            to="/blogs"
            className="group md:hidden flex flex-col justify-center items-center w-full h-16 hover:cursor-pointer"
          >
            <div
              className={`flex justify-center items-center dark:group-hover:bg-mountain-800 group-hover:bg-mountain-100 dark:group-hover:text-mountain-50 group-hover:text-mountain-950 rounded-lg w-[80%] h-8 ${location.pathname === "/blogs"
                ? "bg-mountain-100 dark:bg-mountain-800"
                : "text-mountain-600"
                }`}
            >
              {location.pathname === "/blogs" ? (
                <MdLibraryBooks className="w-6 h-6" />
              ) : (
                <MdOutlineLibraryBooks className="w-6 h-6" />
              )}
            </div>
            <p className="text-[10px]">Blogs</p>
          </Link>
          {/* Shop */}
          <Link
            to="/shop"
            className="group md:hidden flex flex-col justify-center items-center w-full h-16 hover:cursor-pointer"
          >
            <div
              className={`flex justify-center items-center dark:group-hover:bg-mountain-800 group-hover:bg-mountain-100 dark:group-hover:text-mountain-50 group-hover:text-mountain-950 rounded-lg w-[80%] h-8 ${location.pathname === "/shop"
                ? "bg-mountain-100 dark:bg-mountain-800"
                : "text-mountain-600"
                }`}
            >
              {location.pathname === "/shop" ? (
                <RiShoppingBag4Fill className="w-6 h-6" />
              ) : (
                <RiShoppingBag4Line className="w-6 h-6" />
              )}
            </div>
            <p className="text-[10px]">Shop</p>
          </Link>
          {/* Search */}
          <Link
            to="/search"
            className="group md:hidden flex flex-col justify-center items-center w-full h-16 hover:cursor-pointer"
          >
            <div
              className={`flex justify-center items-center dark:group-hover:bg-mountain-800 dark:group-hover:text-mountain-50 group-hover:text-mountain-950 group-hover:bg-mountain-100 rounded-lg w-[80%] h-8 ${location.pathname === "/search"
                ? "bg-mountain-100 dark:bg-mountain-800"
                : "text-mountain-600"
                }`}
            >
              {location.pathname === "/search" ? (
                <FiSearch className="w-6 h-6" />
              ) : (
                <FiSearch className="w-6 h-6" />
              )}
            </div>
            <p className="text-[10px]">Search</p>
          </Link>
          <hr className="md:hidden flex border-mountain-200 dark:border-mountain-700 border-t-1 w-full h-1" />
          {/* Private Features */}
          <ProtectedSidebarItem
            path="/submit-media"
            iconActive={<RiFolderUploadFill className="w-6 h-6" />}
            iconInactive={<RiFolderUploadLine className="w-6 h-6" />}
            label="Submit"
            user={user}
          />
          <ProtectedSidebarItem
            path="/create-art"
            iconActive={<RiImageAiFill className="w-6 h-6" />}
            iconInactive={<RiImageAiLine className="w-6 h-6" />}
            label="Create"
            user={user}
          />
          <ProtectedSidebarItem
            path="/portfolio"
            iconActive={<BsFilePersonFill className="w-6 h-6" />}
            iconInactive={<BsFilePerson className="w-6 h-6" />}
            label="Portfolio"
            user={user}
          />
        </aside>
        {children}
      </div>
    </div>
  );
};

export default InAppLayout;
