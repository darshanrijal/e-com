import { addToCart } from "@/features/wix/api/cart";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import { products } from "@wix/stores";
import { LoadingButton } from "./LoadingButton";
import { ButtonProps } from "./ui/button";
import { useAddItemToCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

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
  const mutation = useAddItemToCart();
  return (
    <LoadingButton
      loading={mutation.isPending}
      className={cn("flex gap-3", className)}
      onClick={() => mutation.mutate({ product, quantity, selectedOptions })}
      {...props}
    >
      <ShoppingCartIcon />
      Add to cart
    </LoadingButton>
  );
};
