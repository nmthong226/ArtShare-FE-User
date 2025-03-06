import React from 'react'
import background from "/back_ground2_v2.png"

export const AuthenLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex bg-white shadow-xl w-full h-full overflow-y-hidden">
            <div className="hidden lg:flex justify-center items-center w-[60%] h-full">
                <img src={background} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-center items-center w-[40%]">
                {children}
            </div>
        </div>
    );
};