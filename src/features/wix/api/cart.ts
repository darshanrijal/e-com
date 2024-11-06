import { getWixClient } from "@/lib/wix-client.base";

export async function getCart() {
  const wixClient = getWixClient();
  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as OWNED_CART_NOT_FOUND_Error).details.applicationError.code ===
      "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    }

    throw error;
  }
}
