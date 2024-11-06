import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
