import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { TextareaAutosize } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import api from "@/api/baseApi";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

// SHADCN Dialog helpers
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { error } from "console";

/* ------------------------------------------------------------------
 * Fields accepted by PATCH /users/profile
 * ----------------------------------------------------------------*/
interface ProfileForm {
  full_name: string;
  username: string;
  bio?: string;
  /** ISO‑8601 date string */
  birthday?: string;
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
      birthday: "",
    },
  });

  /* dialog state */
  const [open, setOpen] = useState(true); // Set dialog to open by default
  const timerRef = React.useRef<NodeJS.Timeout>();
  const [popMessage, setPopMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const showDialog = (ok: boolean, text: string) => {
    setPopMessage({ ok, text });
    setOpen(true);
    clearTimeout(timerRef.current as NodeJS.Timeout);
    timerRef.current = setTimeout(() => setOpen(false), 2500); // Close dialog after 2.5 seconds
  };

  const onSubmit = async (raw: ProfileForm) => {
    const payload: ProfileForm = {
      ...raw,
      birthday: raw.birthday ? new Date(raw.birthday).toISOString() : undefined,
    };

    try {
      await api.patch("/users/profile", payload);
      alert("Ok");
      reset(raw);
      setTimeout(() => navigate("/explore"), 2600); // Redirect to explore after a successful update
    } catch (err) {
      console.log(err);

      showDialog(false, "Failed to update profile");
    }
  };

  // Prevent interaction with the rest of the page when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.pointerEvents = "none"; // Disable interactions outside the dialog
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        hideCloseButton
        className="w-full max-w-xl bg-white shadow-xl border border-neutral-200 p-6 rounded-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900 text-center">
            Complete your profile
          </DialogTitle>
        </DialogHeader>
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
              placeholder="your fullname"
              style={{ color: "#6b7280" }}
              {...register("full_name", { required: true, maxLength: 80 })}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.full_name && (
              <p className="text-xs text-rose-500">Display name is required</p>
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
              placeholder="your username"
              style={{ color: "#6b7280" }}
              {...register("username", { required: true, minLength: 3 })}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Birthday <span className="text-rose-500">*</span>
            </label>
            <Input
              id="birthday"
              type="date"
              {...register("birthday", { required: true })}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.birthday && (
              <p className="text-xs text-rose-500">Birthday is required</p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center mt-4 bg-blue-600 text-white rounded-lg p-2"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
        {/* 
        <DialogFooter>
          <DialogClose>
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
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingProfile;
