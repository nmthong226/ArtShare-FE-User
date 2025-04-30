import { useEffect, useRef, useState } from 'react'
import { matchPath, Link, useLocation, useNavigate } from 'react-router-dom';

//Icons
import { TiDeleteOutline } from 'react-icons/ti';
import { FiLogIn, FiSearch } from 'react-icons/fi';
import { InfoIcon } from 'lucide-react';
import { IoMail, IoMailOutline, IoNotifications, IoNotificationsOutline } from 'react-icons/io5';
import { BsPen } from 'react-icons/bs';

//Components
import Tooltip from '@mui/material/Tooltip';
import UserInAppConfigs from '../popovers/UserInAppConfigs';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

//Context
import { useSearch } from "@/contexts/SearchProvider";
import { useUser } from '@/contexts/UserProvider';

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


const Header: React.FC = ({ }) => {
    const { user, loading } = useUser();
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { query, setQuery } = useSearch();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        console.log("Query updated:", query);
    }, [query]);

    const routes = [
        {
            path: "/explore",
            label: "Explore Arts",
            description: "Discover stunning creations shared by artists worldwide"
        },
        {
            path: "/search",
            label: "Search Page",
            description: "Finding beautiful creations that you want to view"
        },
        {
            path: "/blogs",
            label: "Read Blogs",
            description: "Get inspired by stories, tutorials, and creative journeys"
        },
        {
            path: "/posts/new",
            label: "Create Post",
            description: "Share your latest artwork or visual content with the community"
        },
        {
            path: "/posts/:id",
            label: "Post Details",
            description: "View artwork in detail and engage with the artist's post"
        },
        {
            path: "/image/tool/create-art",
            label: "Image Generation",
            description: "Use AI tools to bring your creative ideas to life"
        },
    ];


    const matchedRoute = routes.find(route =>
        matchPath({ path: route.path, end: true }, location.pathname)
    );

    return (
        <nav className={`top-0 z-50 sticky flex justify-between items-center bg-white dark:bg-mountain-950 pr-2 lg:pr-4 border-b-1 border-b-mountain-100 dark:border-b-mountain-700 w-full h-16`}>
            <div className="flex items-center h-full">
                <div className="flex items-center space-x-1 lg:space-x-2 xl:space-x-4 px-4 h-full">
                    <div className='flex items-center space-x-2'>
                        <span className='flex font-medium text-lg'>
                            {matchedRoute?.label || ""}
                        </span>
                        <Tooltip title={matchedRoute?.description || ""}>
                            <InfoIcon className='size-4' />
                        </Tooltip>
                    </div>
                    <div className="hidden top-1/2 left-1/2 absolute lg:flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl w-144 h-10 text-neutral-700 focus-within:text-mountain-950 dark:focus-within:text-mountain-50 dark:text-neutral-300 -translate-x-1/2 -translate-y-1/2">
                        <FiSearch className="left-2 absolute w-5 h-5" />
                        <Input
                            ref={inputRef}
                            className="shadow-inner pr-8 pl-8 rounded-2xl"
                            placeholder="Search"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setInputValue("");
                                    setQuery(inputValue);
                                    inputRef.current?.blur();
                                    navigate(`/search?q=${inputValue}`);
                                }
                            }}
                        />
                        <TiDeleteOutline
                            className={`right-2 text-mountain-600 absolute w-5 h-5 ${inputValue.length <= 0 ? "hidden" : "flex"}`}
                            onClick={() => {
                                setInputValue("");
                                setQuery("");
                            }}
                        />
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
                className={`flex items-center h-full`}
            >
                <UserFunctionality user={user!} loading={loading!} />
                <UserInAppConfigs />
            </div>
        </nav>
    )
}

export default Header