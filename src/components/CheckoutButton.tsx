import { useCartCheckout } from "@/hooks/use-checkout";
import { ButtonProps } from "./ui/button";
import { LoadingButton } from "./LoadingButton";

export const CheckoutButton = (props: ButtonProps) => {
  const { startCheckoutFlow, pending } = useCartCheckout();
  return (
    <LoadingButton loading={pending} onClick={startCheckoutFlow} {...props}>
      Checkout
    </LoadingButton>
  );
};
