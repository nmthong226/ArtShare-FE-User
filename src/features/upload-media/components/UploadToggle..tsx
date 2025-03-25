import { Switch } from "@/components/ui/switch";
import { Image, Video } from "lucide-react";

export default function UploadToggle({
  isImageUpload,
  onToggle,
}: {
  isImageUpload: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg shadow-sm">
      <Image
        className={`h-6 w-6 ${
          isImageUpload ? "text-blue-500" : "text-gray-400"
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isImageUpload ? "text-blue-600" : "text-gray-500"
        }`}
      >
        Upload Art
      </span>
      <Switch checked={!isImageUpload} onCheckedChange={onToggle} />
      <span
        className={`text-sm font-medium ${
          !isImageUpload ? "text-blue-600" : "text-gray-500"
        }`}
      >
        Upload Short
      </span>
      <Video
        className={`h-6 w-6 ${
          !isImageUpload ? "text-blue-500" : "text-gray-400"
        }`}
      />
    </div>
  );
}
