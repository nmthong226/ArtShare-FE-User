const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex bg-mountain-50 dark:bg-gradient-to-b dark:from-mountain-1000 dark:to-mountain-950">
            {children}
        </div>
    );
};

export default RootLayout;