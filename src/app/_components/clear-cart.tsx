"use client";

import { useClearCart } from "@/hooks/use-cart";
import { useEffect } from "react";

export const ClearCart = () => {
  const { mutate } = useClearCart();
  useEffect(mutate, [mutate]);
  return null;
};
