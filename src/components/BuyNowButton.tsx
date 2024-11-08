import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import { useQuickBuy } from "@/hooks/use-checkout";
import { LoadingButton } from "./LoadingButton";
import { CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product;
  quantity: number;
  selectedOptions: SelectedOption;
}

export const BuyNowButton = ({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) => {
  const { startCheckoutFlow, pending } = useQuickBuy();
  return (
    <LoadingButton
      loading={pending}
      onClick={() => startCheckoutFlow({ product, quantity, selectedOptions })}
      variant={"secondary"}
      className={cn("flex gap-3", className)}
      {...props}
    >
      <CreditCardIcon />
      Buy now
    </LoadingButton>
  );
};
