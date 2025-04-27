"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Button, Paper } from "@mui/material"
import { ArrowUpward } from "@mui/icons-material"

export function AvatarSection() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box className="mb-6">
      <Typography variant="body1" className="mb-2">
        Avatar
      </Typography>
      <Paper className="bg-[#1e1e1e] p-4 flex flex-col items-center justify-center">
        <Box className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4 flex items-center justify-center">
          {avatar ? (
            <img src={avatar || "/placeholder.svg"} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            <img
              src="/placeholder.svg?height=128&width=128"
              alt="Default avatar"
              className="w-full h-full object-cover"
            />
          )}
        </Box>
        <Button
          component="label"
          variant="contained"
          startIcon={<ArrowUpward />}
          className="bg-[#1e1e1e] hover:bg-gray-700 text-white border border-gray-600"
        >
          Upload New Avatar
          <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
        </Button>
      </Paper>
    </Box>
  )
}
