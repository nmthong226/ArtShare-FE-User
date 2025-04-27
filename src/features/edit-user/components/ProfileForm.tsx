import type React from "react"
import { Box, Typography, TextField } from "@mui/material"
import { useSettingView } from "@/contexts/SettingUserProfileProvider"
import { UserProfile } from "../api/user-profile.api"

interface ProfileFormProps {
  formData: UserProfile
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>,
  ) => void
  handleDateChange: (date: Date | null, fieldName: string) => void
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ProfileForm({ formData, handleChange, handleDateChange }: ProfileFormProps) {
  const { view }= useSettingView();
  return (  
    <Box className="space-y-6 dark:text-white">
      {view === 'account' &&
      <Box className="space-y-2 ">
        <Typography className="flex items-center">
          <span className="text-red-500 mr-1">*</span> Email
        </Typography>
        <TextField
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          className="bg-[#1e1e1e] rounded"
          InputProps={{
            className: "text-white",
          }}
        />
      </Box> 
      }

{view === 'account' &&
      <Box className="space-y-2 ">
        <Typography className="flex items-center">
          <span className="text-red-500 mr-1">*</span> Password
        </Typography>
        <TextField
          fullWidth
          name="email"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          className="bg-[#1e1e1e] rounded"
          InputProps={{
            className: "text-white",
          }}
        />
      </Box> 
      }

      <Box className="space-y-2 ">
        <Typography className="flex items-center">
          <span className="text-red-500 mr-1">*</span> Username
        </Typography>
        <TextField
          fullWidth
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          className="bg-[#1e1e1e] rounded"
          InputProps={{
            className: "text-white",
          }}
        />
      </Box>

      <Box className="space-y-2">
        <Typography className="flex items-center">
          <span className="text-red-500 mr-1">*</span> Full Name
        </Typography>
        <TextField
          fullWidth
          name="fullname"
          value={formData.full_name}
          onChange={handleChange}
          variant="outlined"
          className="bg-[#1e1e1e] rounded"
          InputProps={{
            className: "text-white",
          }}
        />
      </Box>
      {/* <Box className="space-y-2">
        <Typography className="flex items-center">Birthday</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={formData.birthday}
            onChange={(date) => handleDateChange(date, "birthday")}
            className="w-full bg-[#1e1e1e] rounded text-white"
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                InputProps: {
                  className: "text-white",
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box> */}

      <Box className="space-y-2">
        <Typography className="flex items-center">Birthday</Typography>
        <TextField
          fullWidth
          name="profile_picture_url"
          value={formData.profile_picture_url}
          onChange={handleChange}
          variant="outlined"
          placeholder="28/01/2003"
          className="bg-[#1e1e1e] rounded"
          InputProps={{
            className: "text-white",
          }}
        />
      </Box>
          
      <Box className="space-y-2">
        <Typography className="flex items-center">Bio</Typography>
        <TextField
          fullWidth
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
          className="bg-[#1e1e1e] rounded"
          InputProps={{
            className: "text-white",
          }}
        />
      </Box>
    </Box>
  )
}
