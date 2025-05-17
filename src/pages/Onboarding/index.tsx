import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TextareaAutosize } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import api from "@/api/baseApi";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
// Radix Dialog helpers provided by user
import { Dialog, DialogContent } from "@/components/ui/dialog";

/* ------------------------------------------------------------------
 * Fields accepted by PATCH /users/profile
 * ----------------------------------------------------------------*/
interface ProfileForm {
  full_name: string;
  profile_picture_url: string;
  username: string;
  bio?: string;
  /** ISO‑8601 date string */
  birthday?: string;
  isOnboard?: boolean;
}

const OnboardingProfile: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProfileForm>({
    defaultValues: {
      full_name: "",
      username: "",
      bio: "",
      profile_picture_url: "",
    },
  });

  /* dialog state */
  const [open, setOpen] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const [popMessage, setPopMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const showDialog = (ok: boolean, text: string) => {
    setPopMessage({ ok, text });
    setOpen(true);
    clearTimeout(timerRef.current as NodeJS.Timeout);
    timerRef.current = setTimeout(() => setOpen(false), 2500);
  };

  const onSubmit = async (raw: ProfileForm) => {
    const payload: ProfileForm = {
      ...raw,
      birthday: raw.birthday ? new Date(raw.birthday).toISOString() : undefined,
    };

    try {
      await api.patch("/users/profile", payload);
      showDialog(true, "Profile updated");
      reset(raw);
      setTimeout(() => navigate("/explore"), 2600);
    } catch (err) {
      console.error(err);
      showDialog(false, "Failed to update profile");
    }
  };
  // Prevent interaction with the rest of the page when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.pointerEvents = "none";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <Card className="w-full max-w-xl bg-white shadow-xl border border-neutral-200">
        <CardHeader>
          <h1 className="text-2xl font-bold text-neutral-900">
            Complete your profile
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="full_name"
              >
                Display Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="full_name"
                placeholder="e.g. Jane Doe"
                {...register("full_name", { required: true, maxLength: 80 })}
              />
              {errors.full_name && (
                <p className="text-xs text-rose-500">
                  Display name is required
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="username"
              >
                Username <span className="text-rose-500">*</span>
              </label>
              <Input
                id="username"
                placeholder="jdoe"
                {...register("username", { required: true, minLength: 3 })}
              />
              {errors.username && (
                <p className="text-xs text-rose-500">Username is required</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="bio"
              >
                Bio (optional)
              </label>
              <TextareaAutosize
                id="bio"
                minRows={3}
                maxLength={150}
                className="w-full rounded-md border border-neutral-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-neutral-900"
                placeholder="A short description about you"
                {...register("bio")}
              />
              <p className="text-xs text-neutral-500">
                {150 - (watch("bio")?.length || 0)} characters left
              </p>
            </div>

            {/* Birthday */}
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="birthday"
              >
                Birthday
              </label>
              <Input id="birthday" type="date" {...register("birthday")} />
            </div>

            {/* Profile picture URL */}
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="profile_picture_url"
              >
                Profile picture URL
              </label>
              <Input
                id="profile_picture_url"
                placeholder="https://..."
                {...register("profile_picture_url", {
                  pattern: {
                    value: /^https?:\/\//,
                    message: "Must be a valid URL",
                  },
                })}
              />
              {errors.profile_picture_url && (
                <p className="text-xs text-rose-500">
                  {errors.profile_picture_url.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-center bg-white border border-neutral-200">
          {popMessage && (
            <div className="flex flex-col items-center gap-2">
              {popMessage.ok ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-rose-500" />
              )}
              <p className="text-sm font-medium text-neutral-800 max-w-xs">
                {popMessage.text}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingProfile;
