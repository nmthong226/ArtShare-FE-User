export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex w-full h-screen">
            {children}
        </div>
    );
};