// src/hooks/useUpdateUserProfile.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchUserProfile,
  UpdateUserProfileParams,
  UserProfile,
} from "../api/user-profile.api";

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserProfileParams>({
    mutationFn: (payload: UpdateUserProfileParams) =>
      patchUserProfile(payload),

    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData<UserProfile>(["user-profile"], data);
    },

    onError: (error: Error) => {
      console.error("Failed to update user profile:", error);
    },
  });
}
