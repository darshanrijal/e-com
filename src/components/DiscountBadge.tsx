import { products } from "@wix/stores";
import { Badge } from "./ui/badge";

interface DiscountBadgeProps {
  discount: products.Discount;
}
export const DiscountBadge = ({ discount }: DiscountBadgeProps) => {
  if (discount.type !== "PERCENT") {
    return null;
  }
  return <Badge>-{discount.value}%</Badge>;
};
