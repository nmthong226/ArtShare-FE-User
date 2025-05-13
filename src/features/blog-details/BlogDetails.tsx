import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

//Components
import { Button, Tooltip } from "@mui/material"
import BlogComments from "./components/BlogComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//Icons
import { IoPersonAddOutline } from "react-icons/io5";
import { LuTableOfContents } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";
import RelatedBlogs from "./components/RelatedBlogs";
import { BiComment } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { MdBookmarkBorder } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import Share from "@/components/dialogs/Share";

const BlogDetails = () => {
    const [showAuthorBadge, setShowAuthorBadge] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowAuthorBadge(scrollY > 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="flex w-full h-full">
                <div className="relative flex flex-col w-[20%]">
                    <div className="top-110 z-10 sticky flex justify-center items-center bg-white shadow-md mr-4 ml-auto rounded-full w-12 h-12">
                        <LuTableOfContents className="size-5" />
                    </div>
                    <div className="right-4 bottom-4 z-50 fixed flex justify-center items-center bg-blue-400 shadow-md rounded-full w-12 h-12">
                        <IoIosArrowUp className="mb-1 size-5 text-white" />
                    </div>
                </div>
                <div className="group flex flex-col space-y-4 bg-white/50 shadow p-4 w-[60%]">
                    <div className="flex bg-black w-full h-[200px] overflow-hidden">
                        <img
                            src='https://picsum.photos/id/11/300/200'
                            className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-300 ease-in-out transform"
                        />
                    </div>
                    <div className="flex space-x-2 w-full">
                        <Link to="/blogs" className="underline">Blogs</Link>
                        <span>/</span>
                        <Link to="/blogs/news" className="underline">News</Link>
                        <span>/</span>
                        <span className="text-mountain-600 line-clamp-1">Ambessa – Arcane Fan Art</span>
                    </div>
                    <h1 className="font-medium text-3xl">Ambessa – Arcane Fan Art</h1>
                    <div className="flex items-center space-x-2 text-mountain-600 text-sm">
                        <p>Posted in 2 days ago</p>
                        <span>•</span>
                        <p>5m reading</p>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 to-purple-100 shadow-sm p-2 py-4 rounded-lg">
                        <div className="flex space-x-2">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-between">
                                <p className="text-lg">Fred Taylor</p>
                                <p className="text-mountain-600 text-sm">@fredtaylor</p>
                            </div>
                        </div>
                        <Button className="flex items-center bg-white shadow w-32 h-12 font-thin text">
                            <IoPersonAddOutline className="mr-2 size-4" />
                            <p>Follow</p>
                        </Button>
                    </div>
                    <div className="flex flex-col space-y-2 p-2 rounded-md">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique orci arcu, sed condimentum dui fringilla eget. Quisque ultricies turpis a risus sollicitudin, et aliquam ligula fermentum. Duis finibus vestibulum sollicitudin. Fusce sed magna gravida, faucibus arcu sollicitudin, congue enim. In tellus sapien, dignissim in quam vitae, ultricies eleifend mauris. Sed sed nulla at libero semper suscipit. Cras finibus sollicitudin ligula sit amet vestibulum. Nunc diam justo, suscipit ut nisl a, gravida hendrerit ipsum.</p>
                        <p>Ut sagittis laoreet sem tempus viverra. Phasellus accumsan urna ac viverra sagittis. Proin fringilla elit magna, id rutrum tortor pretium nec. Aliquam non libero sed lectus porttitor laoreet. Sed molestie nunc eget convallis tempus. Duis quis nunc sem. Cras nec aliquet orci, in mollis magna. In dictum felis ac lorem pretium, ut semper nisl volutpat. Pellentesque ac magna elit. Mauris purus nisl, gravida et ante at, rutrum vestibulum metus. Nam eu velit ut tellus pulvinar malesuada blandit vulputate dolor. Morbi cursus vel ex a egestas. Donec molestie arcu non tempor luctus. Cras ligula tortor, semper eu pretium nec, accumsan non diam.</p>
                        <p>Sed sed turpis ut enim eleifend laoreet eu non mauris. Ut vitae nisi quis tellus consectetur mattis. Vestibulum interdum mattis nibh eget sagittis. Donec sit amet lectus in augue dignissim vestibulum. Pellentesque tempus, neque in convallis convallis, mauris erat iaculis odio, id placerat velit augue et risus. Curabitur ipsum arcu, convallis nec eleifend eu, posuere ut quam. Nulla cursus urna at risus maximus, pretium consequat est semper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu nulla id sapien aliquam sodales et quis neque. Praesent id ligula non dui luctus malesuada sed vel ligula. Vivamus facilisis consectetur justo eget rutrum. Nam aliquet fermentum fermentum. Fusce suscipit orci eget pharetra imperdiet.</p>
                        <p>Pellentesque nec tortor dolor. In ut ultrices nunc, in dapibus magna. Mauris efficitur velit eget arcu mattis, et imperdiet nisi vestibulum. Sed sollicitudin massa ut leo ornare venenatis. Phasellus convallis pulvinar dui vel porttitor. Aliquam quis iaculis eros, vel pulvinar felis. Nulla eget lacus porttitor quam ullamcorper malesuada sodales at urna. Aliquam sed felis lorem. Aliquam vitae elit venenatis, volutpat felis ut, cursus nisl. Suspendisse ipsum dolor, tempor nec sagittis a, iaculis blandit ligula. Mauris nisl orci, pellentesque efficitur ullamcorper nec, suscipit et tellus. Integer vestibulum non lorem a dapibus. Fusce at lobortis est, ut sollicitudin quam. Duis commodo at dolor id imperdiet. Nullam id dolor ut urna euismod pulvinar blandit a enim. Vivamus pretium porttitor enim.</p>
                        <p>Mauris ut fringilla tortor. Donec at consequat orci, vitae laoreet sem. Quisque ultrices lectus a quam vehicula accumsan. Donec vel dui bibendum, consequat odio eget, rhoncus ex. Vestibulum in justo dignissim, auctor neque non, tempor purus. Proin vel neque neque. Donec in purus ornare, viverra neque eget, ornare metus. Curabitur vehicula congue tincidunt. Nunc consequat elementum risus id efficitur.</p>
                    </div>
                </div>
                <div className="relative flex flex-col w-[20%]">
                    <div className={`${!showAuthorBadge ? 'opacity-0 pointer-events-none' : 'opacity-100'} space-y-2 flex-col transition ease-in-out duration-300 top-64 z-10 sticky flex justify-center items-center mr-auto ml-4 rounded-full w-14 h-76`}>
                        <div className="relative flex justify-center items-center w-12 h-12">
                            <Avatar>
                                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Tooltip title="Follow" placement="right" arrow>
                                <div className="-right-1 -bottom-1 absolute flex justify-center items-center bg-blue-400 border border-white rounded-full w-5 h-5">
                                    <LuPlus className="text-white" />
                                </div>
                            </Tooltip>
                        </div>
                        <div className={`space-y-2 flex-col transition ease-in-out duration-300 flex justify-between items-center py-1 bg-white shadow-md rounded-full h-full w-full`}>
                            <Tooltip title="Like" placement="right" arrow>
                                <div className="flex justify-center items-center bg-blue-50 hover:bg-blue-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                                    <AiOutlineLike className="mr-1 size-5" />
                                    <p>14</p>
                                </div>
                            </Tooltip>
                            <Tooltip title="Comment" placement="right" arrow>
                                <div className="flex justify-center items-center bg-green-50 hover:bg-green-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                                    <BiComment className="mr-1 size-4" />
                                    <p>5</p>
                                </div>
                            </Tooltip>
                            <Tooltip title="Save" placement="right" arrow>
                                <div className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                                    <MdBookmarkBorder className="size-4" />
                                </div>
                            </Tooltip>
                            <Share
                                tooltipDirection="right"
                                link="http://localhost:5173/blogs/ambessa-arcane-fan-art"
                                className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <BlogComments />
            <RelatedBlogs />
        </div>
    )
}

export default BlogDetails