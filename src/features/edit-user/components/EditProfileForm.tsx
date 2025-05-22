import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, TextareaAutosize } from "@mui/material";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { updateUserProfile } from "../api/user-profile.api";
import axios from "axios";
import { UserProfile } from "@/features/user-profile-public/api/user-profile.api";
import { cn } from "@/lib/utils";

export const EditProfileForm: React.FC<{ initialData: UserProfile }> = ({
  initialData,
}) => {
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<UserProfile>({
    defaultValues: {
      ...initialData,
      birthday: initialData.birthday ? initialData.birthday.slice(0, 10) : "",
    },
  });

  const isAbove13 = (birthday: string) => {
    const birth = new Date(birthday);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age >= 13;
  };

  const onSubmit = async (raw: UserProfile) => {
    if (raw.birthday && !isAbove13(raw.birthday)) {
      showSnackbar("You must be at least 13 years old.", "error");
      return;
    }

    const payload = {
      full_name: raw.full_name,
      bio: raw.bio,
      username: raw.username,
      birthday: new Date(raw.birthday ?? "").toISOString(),
    };

    try {
      await updateUserProfile(payload);
      reset(raw);
      showSnackbar("Profile updated successfully!", "success");
    } catch (err: unknown) {
      let msg = "Failed to update profile";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
        console.log(err);
        if (msg.includes("Duplicate value for field(s): username")) {
          showSnackbar(
            "Username already exists. Please choose a different username.",
            "error",
          );
          document.getElementById("username")?.focus();
          return;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      showSnackbar(msg, "error");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen rounded-none dark:bg-mountain-900 dark:rounded-md p-6"
    >
      {/* Full Name */}
      <Box className="mb-4">
        <Typography className="mb-1 font-medium">
          Display Name <span className="text-rose-500">*</span>
        </Typography>
        <Input
          id="full_name"
          placeholder="Your Fullname"
          {...register("full_name", {
            required: "Display name is required",
            maxLength: 80,
          })}
        />
        {errors.full_name && (
          <Typography color="error" variant="caption">
            {errors.full_name.message}
          </Typography>
        )}
      </Box>

      {/* Username */}
      <Box className="mb-4">
        <Typography className="mb-1 font-medium">
          Username <span className="text-rose-500">*</span>
        </Typography>
        <Input
          id="username"
          placeholder="Your Username"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "At least 3 characters" },
            maxLength: { value: 20, message: "At most 20 characters" },
            pattern: {
              value: /^(?!.*\s)[a-z0-9_-]{3,20}$/i,
              message: "Use letters, numbers, _ or - (no spaces)",
            },
          })}
        />
        {errors.username && (
          <Typography color="error" variant="caption">
            {errors.username.message}
          </Typography>
        )}
      </Box>

      {/* Birthday */}
      <Box className="mb-4">
        <Typography className="mb-1 font-medium">
          Birthday <span className="text-rose-500">*</span>
        </Typography>
        <Input
          id="birthday"
          type="date"
          {...register("birthday", {
            required: "Birthday is required",
            validate: (v) =>
              isAbove13(v ? v : "") || "You must be at least 13 years old.",
          })}
        />
        {errors.birthday && (
          <Typography color="error" variant="caption">
            {errors.birthday.message}
          </Typography>
        )}
      </Box>

      {/* Bio */}
      <Box className="mb-6">
        <Typography className="mb-1 font-medium">Bio (optional)</Typography>
        <TextareaAutosize
          minRows={3}
          maxLength={150}
          placeholder="A short description about you"
          {...register("bio")}
          className={cn(
            // === same base styles as your Input ===
            "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground " +
              "w-full min-w-0 rounded-md border bg-white dark:bg-transparent dark:border-mountain-300 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] " +
              "outline-none resize-none " + // keep resize-none
              "hover:border-gray-300 " + // hover state
              "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[2px] " +
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          )}
        />
        <Typography variant="caption" className="text-gray-500">
          {150 - (watch("bio")?.length || 0)} characters left
        </Typography>
      </Box>

      {/* Submit */}
      <Box className="text-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
          Save changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfileForm;
