// Core
import React, { useEffect, useState } from "react";

// Components
import Sidebar from "@/components/sidebar/app-sidebar";
import Header from "@/components/header/app-header";

const InAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expandSideBar, setExpandSideBar] = useState(true);
  return (
    <div className={`relative flex flex-row w-full h-full`}>
      <Sidebar expand={expandSideBar} setExpand={setExpandSideBar} />
      <div className={`flex flex-col flex-1 flex-shrink min-w-[calc(100vw-16rem)] h-full`}>
        <Header />
        <div className={`border-l-1 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default InAppLayout;
