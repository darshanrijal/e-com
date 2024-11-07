import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { addToCart } from "@/features/wix/api/cart";
import { wixBrowserClient } from "@/lib/wix-client-browser";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: SelectedOption;
  quantity: number;
}
export const AddToCartButton = ({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: AddToCartButtonProps) => {
  return (
    <Button
      onClick={() =>
        addToCart(wixBrowserClient, { product, quantity, selectedOptions })
      }
      {...props}
    >
      Add to cart
    </Button>
  );
};
