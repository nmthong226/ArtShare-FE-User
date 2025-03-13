import { useLanguage } from "@/context/LanguageProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-center items-center space-x-1 bg-gray-100 px-4 rounded-lg w-fit hover:cursor-pointer">
                    <Globe className="w-4 h-4" />
                    <p className="text-sm">{language}</p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>🇺🇸 English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("vi")}>🇻🇳 Tiếng Việt</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
