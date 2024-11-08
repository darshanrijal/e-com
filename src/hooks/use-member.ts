import { useRouter } from "next/navigation";
import { toast } from "./use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  updateMemberInfo,
  UpdateMemberInfoValues,
} from "@/features/wix/api/members";
import { wixBrowserClient } from "@/lib/wix-client-browser";

export function useUpdateMember() {
  const router = useRouter();
  return useMutation({
    mutationFn: (values: UpdateMemberInfoValues) =>
      updateMemberInfo(wixBrowserClient, values),
    onSuccess: () => {
      toast({ description: "Profile updated" });
      router.refresh();
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile, Please try again",
      });
    },
  });
}
