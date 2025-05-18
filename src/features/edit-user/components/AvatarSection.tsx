import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getPresignedUrl, uploadFile } from "@/api/storage";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { nanoid } from "nanoid";
import { updateUserProfile } from "../api/user-profile.api";

interface AvatarSectionProps {
  profilePictureUrl?: string | null;
  onUploadSuccess: (newUrl: string) => void;
}

export function AvatarSection({
  profilePictureUrl,
  onUploadSuccess,
}: AvatarSectionProps) {
  const [preview, setPreview] = useState<string | null>(profilePictureUrl || null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
  }, [preview])

  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: async (file) => {
      const ext = file.type.split("/")[1];
      const key = `avatars/${nanoid(8)}.${ext}`;
      const { presignedUrl, fileUrl } = await getPresignedUrl(
        key,
        ext,
        "image",
        "users"
      );
      await uploadFile(file, presignedUrl);
      return fileUrl;
    },
    onSuccess: async (fileUrl) => {
      try {
        // 3) update user record
        await updateUserProfile({ profile_picture_url: fileUrl });
        // 4) update local preview + notify parent
        setPreview(fileUrl);
        onUploadSuccess(fileUrl);
        showSnackbar("Avatar updated", "success");
      } catch (err: any) {
        showSnackbar("Saved to storage, but failed to update profile", "error");
      }
    },
    onError: (err) => {
      showSnackbar(err.message || "Failed to upload avatar", "error");
    },
  });

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPreview(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // kick off the mutation
    uploadMutation.mutate(file);
  };

  return (
    <>
      <Backdrop open={uploadMutation.isPending} sx={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box className="mb-6">
        <Typography variant="body1" className="mb-2 text-white">
          Avatar
        </Typography>
        <Paper className="bg-[#1e1e1e] p-4 flex flex-col items-center justify-center">
          <Box className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
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
            className="bg-[#1e1e1e] hover:bg-gray-700 text-white border border-gray-600"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading…" : "Upload New Avatar"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploadMutation.isPending}
            />
          </Button>
        </Paper>
      </Box>
    </>
  );
}
