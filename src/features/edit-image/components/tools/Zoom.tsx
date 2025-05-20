import React from 'react'
import { LuZoomIn, LuZoomOut } from 'react-icons/lu'

interface ZoomTool {
    zoomLevel: number;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
}

const ZoomTool: React.FC<ZoomTool> = ({ zoomLevel, handleZoomIn, handleZoomOut }) => {
    return (
        <div className='top-1/2 -right-14 absolute flex flex-col justify-between items-center space-y-1 bg-white opacity-50 hover:opacity-100 p-1 border border-mountain-200 rounded-xl w-12 h-48 -translate-y-1/2 duration-200 ease-in-out transform'>
            <div onClick={handleZoomIn} className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-[25%] hover:cursor-pointer select-none'>
                <LuZoomIn />
            </div>
            <div className='flex justify-center items-center bg-indigo-50 p-2 rounded-lg w-full h-[50%] font-medium text-mountain-600 text-sm'>
                {Math.round(zoomLevel * 100)}%
            </div>
            <div onClick={handleZoomOut} className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-[25%] hover:cursor-pointer select-none'>
                <LuZoomOut />
            </div>
        </div>
    )
}

export default ZoomTool