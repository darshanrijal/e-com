import { getProductById } from "@/features/wix/api/products";
import { getWixServerClient } from "@/lib/wix-client-server";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ createReview: string }>;
}) {
  const [{ id }, sParams, wixServerClient] = await Promise.all([
    params,
    searchParams,
    getWixServerClient(),
  ]);

  if (id === "someId") {
    redirect(`/products/i-m-a-product-1?${new URLSearchParams(sParams)}`);
  }
  const product = await getProductById(wixServerClient, id);
  if (!product) notFound();

  redirect(`/products/${product.slug}?${new URLSearchParams(sParams)}`);
}
