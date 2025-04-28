// Core Lib/Frameworks
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  // useRef,
} from "react";
import { useLocation } from "react-router-dom";

// Context

// Components
import Sidebar from "@/components/sidebar/app-sidebar";
import Header from "@/components/heading/header";

// Icons

export const SearchContext = createContext<{
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}>({
  query: "",
  setQuery: () => { },
});

const InAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // const { user, loading } = useUser();


  return (
    <div className="flex flex-row w-full h-full">
      <Sidebar />
      <div className="flex flex-col w-full h-full">
        <Header />
        <div className={`border-l-1 border-l-mountain-100 dark:border-l-mountain-700 h-full ${location.pathname === "/explore" || location.pathname === "/short" ? "w-[calc(100vw-16rem)]" : "w-full"}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default InAppLayout;
