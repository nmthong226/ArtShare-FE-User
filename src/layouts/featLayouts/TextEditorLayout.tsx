// Core Lib/Frameworks
import React, {
    // useState,
} from "react";

// Components
// import Sidebar from "@/components/sidebar/app-sidebar";
import TextEditorHeader from "@/components/header/text-editor-header";

const TextEditorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [expandSideBar, setExpandSideBar] = useState(false);
    return (
        <div className={`flex flex-row w-full h-full`}>
            {/* <Sidebar expand={expandSideBar} setExpand={setExpandSideBar} /> */}
            <div className={`flex flex-col flex-1 flex-shrink w-[calc(100vw-16rem)] h-full`}>
                <TextEditorHeader />
                <div className={`border-l-1 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default TextEditorLayout;
