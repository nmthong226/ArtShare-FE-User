"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Button, Paper } from "@mui/material"
import { ArrowUpward } from "@mui/icons-material"

export function CoverSection() {
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box>
      <Typography variant="body1" className="mb-2">
        Cover Label
      </Typography>
      <Paper className="bg-[#1e1e1e] p-4 flex flex-col items-center justify-center">
        <Box className="w-full h-32 bg-gray-800 mb-4 overflow-hidden">
          {coverImage ? (
            <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
          )}
        </Box>
        <Button
          component="label"
          variant="contained"
          startIcon={<ArrowUpward />}
          className="bg-[#1e1e1e] hover:bg-gray-700 text-white border border-gray-600"
        >
          Change cover image (1920x640+)
          <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
        </Button>
      </Paper>
    </Box>
  )
}
