import React from 'react'
import background from "/back_ground2_v2.png"
import { ThemeToggle } from '@/components/buttons/ThemeToggle';
import { LanguageSwitcher } from '@/components/buttons/LanguageSwitcher';

export const AuthenLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex justify-center items-center gap-x-4 bg-white shadow-xl w-full h-full overflow-hidden">
            <div className="hidden md:flex justify-center items-center w-[60%] h-full">
                <img src={background} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-center items-center w-[40%]">
                <div className="top-5 right-[5%] absolute flex space-x-2">
                    <ThemeToggle />
                    <LanguageSwitcher />
                </div>
                {children}
            </div>
        </div>
    );
};