import { getCheckoutUrlForCurrentCart } from "@/features/wix/api/checkout";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import React from "react";
import { toast } from "./use-toast";

export function useCartCheckout() {
  const [pending, setPending] = React.useState(false);

  async function startCheckoutFlow() {
    try {
      setPending(true);
      const checkoutUrl = await getCheckoutUrlForCurrentCart(wixBrowserClient);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to load checkout, Please try again",
      });
    } finally {
      setPending(false);
    }
  }

  return { startCheckoutFlow, pending };
}
