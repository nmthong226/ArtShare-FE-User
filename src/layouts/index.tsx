const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex dark:bg-gradient-to-b dark:from-mountain-1000 dark:to-mountain-950 overflow-hidden">
            <div className="-z-10 fixed inset-0 bg-gradient-to-t dark:bg-gradient-to-b from-indigo-200 dark:from-mountain-1000 via-indigo-100 to-purple-50 dark:to-mountain-950" />
            {children}
        </div>
    );
};

export default RootLayout;