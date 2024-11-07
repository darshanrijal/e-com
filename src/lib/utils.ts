import { products } from "@wix/stores";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/../tailwind.config";

export const twConfig = resolveConfig(tailwindConfig);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(delay: number = 0) {
  return new Promise((r) => setTimeout(r, delay));
}

export const formatCurrency = (
  price: number | string = 0,
  currency: string = "NPR",
) =>
  Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(price));

export function findVariant(
  product: products.Product,
  selectedOption: SelectedOption,
) {
  if (!product.manageVariants) {
    return null;
  }

  return (
    product.variants?.find((variant) =>
      Object.entries(selectedOption).every(
        ([key, value]) => variant.choices?.[key] === value,
      ),
    ) || null
  );
}

export function checkInStock(
  product: products.Product,
  selectedOption: SelectedOption,
) {
  const variant = findVariant(product, selectedOption);
  return variant
    ? variant.stock?.quantity !== 0 && variant.stock?.inStock
    : product.stock?.inventoryStatus === products.InventoryStatus.IN_STOCK ||
        product.stock?.inventoryStatus ===
          products.InventoryStatus.PARTIALLY_OUT_OF_STOCK;
}
