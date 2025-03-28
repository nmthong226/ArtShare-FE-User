const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex bg-mountain-50 dark:bg-mountain-950 w-full">
            {children}
        </div>
    );
};

export default RootLayout;