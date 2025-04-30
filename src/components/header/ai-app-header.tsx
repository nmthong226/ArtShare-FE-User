import { matchPath, Link, useLocation } from 'react-router-dom';

//Assets

//Icons
import { FiLogIn } from 'react-icons/fi';
import { InfoIcon } from 'lucide-react';
import { IoMail, IoMailOutline, IoNotifications, IoNotificationsOutline } from 'react-icons/io5';
import { BsPen } from 'react-icons/bs';
import { LuImageUpscale } from "react-icons/lu";
import { BiEdit } from "react-icons/bi";
import { FaArrowLeftLong } from "react-icons/fa6";

//Components
import Tooltip from '@mui/material/Tooltip';
import UserInAppConfigs from '../popovers/UserInAppConfigs';
import { Skeleton } from '../ui/skeleton';

//Context
import { useUser } from '@/contexts/UserProvider';
import { RiImageAiLine } from 'react-icons/ri';

const UserFunctionality: React.FC<{
    user?: User | null;
    loading?: boolean;
}> = ({ user, loading }) => {
    const location = useLocation();

    // Show a loading indicator while checking authentication
    if (loading) {
        return (
            <>
                <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"></Skeleton>
                <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"></Skeleton>
            </>
        );
    }

    // Show Sign Up and Login for non-logged-in users
    if (!user || Object.keys(user).length === 0) {
        return (
            <>
                <Link
                    to="/signup"
                    className="hidden xs:flex justify-center items-center space-x-2 border border-mountain-950 rounded-2xl w-24 xl:w-26 h-9 text-muted-foreground text-sm"
                >
                    <BsPen />
                    <p>Sign Up</p>
                </Link>
                <Link
                    to="/login"
                    className="flex justify-center items-center space-x-2 bg-mountain-950 hover:bg-mountain-600 dark:bg-mountain-200 rounded-2xl w-20 xl:w-26 h-9 text-mountain-100 dark:text-mountain-950 text-sm"
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
                className={`hidden xs:flex group items-center h-full ${location.pathname === "/messages"
                    ? "dark:text-mountain-50 text-mountain-950"
                    : "dark:text-mountain-500 text-mountain-700"
                    }`}
            >
                <div className="flex items-center hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
                    {location.pathname === "/messages" ? (
                        <IoMail className="size-5" />
                    ) : (
                        <IoMailOutline className="size-5" />
                    )}
                </div>
            </Link>
            <Link
                to="/messages"
                className={`hidden xs:flex group items-center mr-2 h-full ${location.pathname === "/messages"
                    ? "dark:text-mountain-50 text-mountain-950"
                    : "dark:text-mountain-500 text-mountain-700"
                    }`}
            >
                <div className="flex items-center hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
                    {location.pathname === "/updates" ? (
                        <IoNotifications className="size-5" />
                    ) : (
                        <IoNotificationsOutline className="size-5" />
                    )}
                </div>
            </Link>
        </>
    );
};

const AIHeader = () => {
    const { user, loading } = useUser();
    const location = useLocation();

    const routes = [
        {
            path: "/image/tool/text-to-image",
            label: "Text To Image",
            description: "Use AI tools to bring your creative ideas to life"
        },
        {
            path: "/image/tool/editor",
            label: "Image Editor",
            description: "Edit and enhance your images with powerful built-in tools"
        },
    ];


    const matchedRoute = routes.find(route =>
        matchPath({ path: route.path, end: true }, location.pathname)
    );

    return (
        <nav className={`z-50 flex relative justify-between items-center bg-white dark:bg-mountain-950 pr-2 lg:pr-4 border-b-1 border-b-mountain-100 dark:border-b-mountain-700 w-full h-16`}>
            <div className="flex items-center px-4 h-full">
                <Link to="/explore" className='flex justify-center items-center hover:bg-mountain-100 mr-4 p-2 rounded-lg'>
                    <FaArrowLeftLong className='size-5 text-mountain-600' />
                </Link>
                <div className='flex items-center space-x-2'>
                    <span className='flex font-medium text-lg'>
                        {matchedRoute?.label || ""}
                    </span>
                    <Tooltip title={matchedRoute?.description || ""}>
                        <InfoIcon className='size-4' />
                    </Tooltip>
                </div>
            </div>
            <div className="hidden top-1/2 left-1/2 absolute lg:flex justify-between items-center space-x-2 bg-mountain-50 px-2 rounded-2xl w-128 h-10 -translate-x-1/2 -translate-y-1/2">
                {[
                    { label: 'Text To Image', href: '/image/tool/text-to-image', icon: RiImageAiLine },
                    { label: 'Creative Upscale', href: '/image/tool/upscale', icon: LuImageUpscale },
                    { label: 'Image Editor', href: '/image/tool/editor', icon: BiEdit },
                ].map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link key={index} to={item.href} className={`${isActive ? 'text-mountain-950' : 'text-mountain-400'} flex justify-center items-center space-x-2 bg-white shadow py-1.5 rounded-xl w-40 text-mountain-600 hover:text-mountain-950 hover:scale-105 duration-200 ease-in-out hover:cursor-pointer transform`}>
                            <item.icon className='size-4' />
                            <p className='text-sm'>{item.label}</p>
                        </Link>
                    )
                })}
            </div>
            <div
                className={`flex items-center h-full`}
            >
                <UserFunctionality user={user!} loading={loading!} />
                <UserInAppConfigs />
            </div>
        </nav>
    )
}

export default AIHeader