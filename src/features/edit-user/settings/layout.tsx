import { useSettingView } from "@/contexts/SettingUserProfileProvider";
import { List, ListItemIcon, ListItemText, IconButton, Typography, Box, ListItemButton } from "@mui/material"
import { User, Settings, Bell, X } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  console.log(params);
  return (
    <div className="flex min-h-screen bg-white">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto">
        <Box>{children}</Box>
      </main>
    </div>
  )
}

function SettingsSidebar() {
  const { setView }= useSettingView();
  return (
    <Box className="w-64 dark:bg-black dark:text-white">
      <Box className="flex items-center justify-between p-4 border-b border-gray-200">
        <Typography variant="h6" className="font-medium">
          Settings
        </Typography>
        <IconButton href="/" className="text-gray-500 hover:text-gray-700 dark:text-white">
          <X size={20} />
        </IconButton>
      </Box>
      <List>
        <ListItemButton onClick={() => setView("profile")}>
          <ListItemIcon><User size={18} /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton onClick={() => setView("account")}>
          <ListItemIcon><Settings size={18} /></ListItemIcon>
          <ListItemText primary="Account" />
        </ListItemButton>
        <ListItemButton onClick={() => setView("notification")}>
          <ListItemIcon><Bell size={18} /></ListItemIcon>
          <ListItemText primary="Notification" />
        </ListItemButton>
      </List>
    </Box>
  )
}
