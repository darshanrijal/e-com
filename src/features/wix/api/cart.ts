import { WIX_STORES_APP_ID } from "@/constansts";
import { findVariant } from "@/lib/utils";
import { getWixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

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

interface AddToCartValues {
  product: products.Product;
  selectedOptions: SelectedOption;
  quantity: number;
}
export async function addToCart({
  product,
  quantity,
  selectedOptions,
}: AddToCartValues) {
  const wixClient = getWixClient();
  const selectedVariant = findVariant(product, selectedOptions);
  return wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product._id,
          options: selectedVariant
            ? {
                variantId: selectedVariant._id,
              }
            : { options: selectedOptions },
        },
        quantity,
      },
    ],
  });
}
