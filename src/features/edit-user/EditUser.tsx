// src/pages/EditUser.tsx

import React, { useState } from "react";
import { Box, Button, Container, Snackbar, Alert } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { AvatarSection } from "./components/AvatarSection";
import { UserProfile } from "./api/user-profile.api";
import { useUpdateUserProfile } from "./hooks/use-update-user";

type Props = {
  profileData: UserProfile;
};

export default function EditUser({ profileData }: Props) {
  const [formData, setFormData] = useState({
    username: profileData.username,
    email: profileData.email,
    full_name: profileData.full_name ?? "",
    bio: profileData.bio ?? "",
    profile_picture_url: profileData.profile_picture_url ?? "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const {
    mutate: patchProfile,
    isPending: saving,
    reset,
  } = useUpdateUserProfile();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSave = () => {
    reset();
    patchProfile(
      {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name || null,
        bio: formData.bio || null,
        profile_picture_url: formData.profile_picture_url || null,
      },
      {
        onSuccess: (updated) => {
          setFormData({
            username: updated.username,
            email: updated.email,
            full_name: updated.full_name ?? "",
            bio: updated.bio ?? "",
            profile_picture_url: updated.profile_picture_url ?? "",
          });
          setSnackbar({
            open: true,
            message: "Profile updated successfully!",
            severity: "success",
          });
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: "Failed to update profile. Please try again.",
            severity: "error",
          });
        },
      }
    );
  };

  return (
    <Container disableGutters className="min-h-screen bg-[#121212]">
      <ProfileHeader />

      <Box className="p-6 m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileForm
          formData={formData}
          handleChange={handleChange}
          onSubmit={handleSave}
          isSubmitting={saving}
        />
        <Box>
          <AvatarSection
            profilePictureUrl={formData.profile_picture_url}
            onChange={(url: string) =>
              setFormData((prev) => ({ ...prev, profile_picture_url: url }))
            }
          />
        </Box>
      </Box>

      <Box className="p-6">
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<ArrowUpward />}
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
