import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button onClick={toggleTheme} className="flex bg-mountain-100 hover:bg-gray-200 dark:bg-mountain-900 dark:hover:bg-mountain-800 w-10 hover:cursor-pointer">
            {theme === "dark" ? <Sun className="hover:bg-gray-500 dark:hover:bg-mountain-100 w-5 h-5 text-gray-800 dark:text-mountain-50" /> : <Moon className="hover:bg-gray-500 w-5 h-5 text-gray-800 cursor-pointer" />}
        </Button>
    );
}
