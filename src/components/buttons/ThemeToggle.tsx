import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button onClick={toggleTheme} className="flex bg-gray-100 w-10">
            {theme === "dark" ? <Sun className="w-5 h-5 text-gray-800" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </Button>
    );
}
