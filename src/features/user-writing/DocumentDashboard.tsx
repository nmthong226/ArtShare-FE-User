import { IoBookOutline, IoFilter } from "react-icons/io5"
import { MdOutlineAdd } from "react-icons/md"
import { TbListNumbers } from "react-icons/tb"
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

const DocumentDashboard = () => {
    const [order, setOrder] = React.useState<"today" | "last7days" | "last30days">("today");
    const handleChange = (event: SelectChangeEvent) => {
        setOrder(event.target.value as "today" | "last7days" | "last30days");
    };
    return (
        <div className="flex flex-col items-center h-screen">
            <div className="flex justify-center shadow-md border-mountain-50 border-b-1 w-full h-fit">
                <div className="flex flex-col justify-center items-center space-y-2 p-4 w-fit h-full">
                    <div className="flex space-x-4 h-full">
                        <Link to="/docs/new" className="flex flex-col justify-center space-y-4">
                            <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                                    <MdOutlineAdd className="size-10" />
                                </div>
                            </div>
                            <p className="text-mountain-800 text-sm">Blank Document</p>
                        </Link>
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                                    <IoBookOutline className="size-8" />
                                </div>
                            </div>
                            <p className="text-mountain-800 text-sm">Tutorial Template</p>
                        </div>
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="flex justify-center items-center bg-mountain-50 border-1 border-white hover:border-indigo-600 w-42 h-48">
                                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full w-16 h-16">
                                    <TbListNumbers className="size-8" />
                                </div>
                            </div>
                            <p className="text-mountain-800 text-sm">Sale Template</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-6 p-4 w-full h-screen">
                <div className="flex justify-between items-center w-full h-fit">
                    <p className="font-medium text-lg">Recent documents</p>
                    <div className="flex">
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                value={order}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ "aria-label": "Order By" }}
                                MenuProps={{
                                    disableScrollLock: true,
                                }}
                                className="relative pl-8 rounded-full w-36"
                            >
                                <MenuItem value={"today"}>Today</MenuItem>
                                <MenuItem value={"last7days"}>7 days</MenuItem>
                                <MenuItem value={"last30days"}>30 days</MenuItem>
                            </Select>
                            <IoFilter className="top-1/2 left-4 absolute -translate-y-1/2" />
                        </FormControl>
                    </div>
                </div>
                <div className="flex flex-wrap space-x-12">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="flex justify-center items-end bg-mountain-50 border-1 border-white hover:border-indigo-600 rounded-lg w-48 h-48">
                            <div className="flex bg-white shadow-[0px_0px_16px_rgba(0,0,0,0.06)] p-2 w-[70%] h-[80%] text-mountain-400">
                                <span className="text-xs select-none">My document</span>
                            </div>
                        </div>
                        <p className="w-42 text-mountain-800 text-sm line-clamp-1">My darkiest memory about some</p>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="flex justify-center items-end bg-mountain-50 border-1 border-white hover:border-indigo-600 rounded-lg w-48 h-48">
                            <div className="flex flex-col bg-white shadow-[0px_0px_16px_rgba(0,0,0,0.06)] p-2 w-[70%] h-[80%] text-mountain-400">
                                <span className="text-xs select-none">My document</span>
                            </div>
                        </div>
                        <p className="text-mountain-800 text-sm">Blank Document</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentDashboard