import { WIX_STORES_APP_ID } from "@/constansts";
import { findVariant } from "@/lib/utils";
import { getWixClient, WixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

export async function getCart(wixClient: WixClient) {
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

export interface AddToCartValues {
  product: products.Product;
  selectedOptions: SelectedOption;
  quantity: number;
}
export async function addToCart(
  wixClient: WixClient,
  { product, quantity, selectedOptions }: AddToCartValues,
) {
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

export interface UpdateCartItemQuantityValues {
  productId: string;
  newQuantity: number;
}
export async function updateCartItemQuantity(
  wixClient: WixClient,
  { newQuantity, productId }: UpdateCartItemQuantityValues,
) {
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([
    {
      _id: productId,
      quantity: newQuantity,
    },
  ]);
}

export async function removeCartItem(wixClient: WixClient, productId: string) {
  return wixClient.currentCart.removeLineItemsFromCurrentCart([productId]);
}
