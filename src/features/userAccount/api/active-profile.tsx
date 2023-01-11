import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@tyro/api";

export function useMutateActiveProfile() {
  const queryClient = useQueryClient();
  return  useMutation({

    mutationFn: async (profileId: number) => {
      console.log(`request to active profile ${profileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.all);
    },
  });
}