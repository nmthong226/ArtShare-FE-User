// Core
import { useState } from "react";

// Context/hooks
import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

// Icons
import { FaReact } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

// Components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const UserInAppConfigs = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { toggleTheme } = useTheme();

  const [matureContent, setMatureContent] = useState(false);
  const [aiContent, setAiContent] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="ghost"
            title="More"
            className={`flex items-center bg-gradient-to-b ${
              !user ? "from-blue-800 to-pink-800" : "from-mountain-800 to-mountain-300"
            } rounded-full w-8 h-8`}
            onMouseEnter={() => setOpen(true)}
          >
            <FaReact className="size-5 text-white" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="dark:bg-mountain-900 mt-4 p-0 py-2 dark:border-mountain-700 w-64"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {!user && (
          <>
            <div className="flex p-3 py-2 w-full">
              <div className="flex items-end space-x-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-mountain-950 dark:text-mountain-50">User Sample</p>
                  <p className="text-mountain-500 text-xs">example123@gmail.com</p>
                </div>
              </div>
            </div>
            <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
            <div className="flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="bg-clip-text bg-gradient-to-r from-blue-800 dark:from-blue-500 to-pink-800 dark:to-pink-500 text-transparent text-sm">
                Become Seller
              </p>
            </div>
            <div className="flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="text-sm">User Profile</p>
            </div>
            <div className="xs:hidden flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="text-sm">Message</p>
            </div>
            <div className="xs:hidden flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="text-sm">Update</p>
            </div>
            <div className="flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="text-sm">Settings</p>
            </div>
            <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
          </>
        )}
        <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
          <span className="text-sm">Theme</span>
          <div className="flex space-x-2">
            <Button
              onClick={toggleTheme}
              className={`border-2 border-indigo-600 dark:border-mountain-600 dark:bg-mountain-800 rounded-full size-8`}
              variant={"outline"}
            >
              <MdLightMode className="size-5" />
            </Button>
            <Button
              onClick={toggleTheme}
              className={`rounded-full dark:border-2 dark:border-indigo-600 dark:bg-mountain-800 size-8`}
              variant={"outline"}
            >
              <MdDarkMode className="size-5" />
            </Button>
          </div>
        </div>
        <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
        <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
          <span className="text-sm">Mature Content</span>
          <Switch checked={matureContent} onCheckedChange={setMatureContent} className="hover:cursor-pointer" />
        </div>
        <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
          <span className="text-sm">AI Content</span>
          <Switch checked={aiContent} onCheckedChange={setAiContent} className="hover:cursor-pointer" />
        </div>
        {!user && (
          <>
            <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
            <div className="flex items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="text-sm">Help Center</p>
            </div>
            <div className="flex items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
              <p className="text-sm">Logout</p>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserInAppConfigs;
