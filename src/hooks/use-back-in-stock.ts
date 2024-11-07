import { useMutation } from "@tanstack/react-query";
import { toast } from "./use-toast";
import {
  BackInStockNotificationRequestsValues,
  createBackInStockNotificationRequests,
} from "@/features/wix/api/backInStore";
import { wixBrowserClient } from "@/lib/wix-client-browser";

export function useCreateBackInStockNotificationRequest() {
  return useMutation({
    mutationFn: (values: BackInStockNotificationRequestsValues) =>
      createBackInStockNotificationRequests(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      if (
        (error as unknown as BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXIST)
          .details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "You are already subscribed to this product",
        });
        return;
      }

      toast({
        variant: "destructive",
        description: "Something went wrong, Please try again",
      });
    },
  });
}
