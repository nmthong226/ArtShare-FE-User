
import React, { useEffect, useState } from "react";
import { Box, Button, Container } from "@mui/material";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { AvatarSection } from "./components/AvatarSection";
import { getUserProfile, UserProfile } from "../user-profile-public/api/user-profile.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { UpdateUserDTO, updateUserProfile } from "./api/user-profile.api";
import LoadingSpinner from "@/components/fallbacks/LoadingSpinner";


export default function EditUser() {
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();
    const {
    data: profileData, 
    isLoading: loadingProfile
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const { mutate: saveProfile, isPending: saving } = useMutation<
    UserProfile,
    Error,
    UpdateUserDTO
  >({
    mutationFn: async (payload: UpdateUserDTO) => {
      const response = await updateUserProfile(payload);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile"], updated);
      showSnackbar("Profile updated successfully.", "success");
    },
    onError: (err) => {
      showSnackbar(err.message ?? "Failed to update profile.", "error");
    },
  });

  const [formData, setFormData] = useState<UserProfile | null>({
    id: profileData?.id ?? "",
    username: profileData?.username ?? "",
    email: profileData?.email ?? "",
    full_name: profileData?.full_name ?? "",
    bio: profileData?.bio ?? "",
    profile_picture_url: profileData?.profile_picture_url ?? "",
    followings_count: profileData?.followings_count ?? 0,
    followers_count: profileData?.followers_count ?? 0,
    isFollowing: profileData?.isFollowing ?? false,
    birthday: profileData?.birthday ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((f) => (f ? { ...f, [name]: value } : f));
  };

  const handleSave = () => {
    if (!formData) return;
    const payload: UpdateUserDTO = {
      email: formData.email,
      username: formData.username,
      full_name: formData.full_name,
      bio: formData.bio,
      profile_picture_url: formData.profile_picture_url,
      birthday: formData.birthday,
    };
    saveProfile(payload);
  };

  if (loadingProfile || !formData) {
    return (
      <div className="m-4 text-center">
        <LoadingSpinner />
      </div>
    );
  }

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
            onUploadSuccess={(newUrl: string) =>
            setFormData((prev) =>
              prev ? { ...prev, profile_picture_url: newUrl } : prev
            )
        }
          />
        </Box>
      </Box>

      <Box className="p-6">
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </Box>
    </Container>
  );
}