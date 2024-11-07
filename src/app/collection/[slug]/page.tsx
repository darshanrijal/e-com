import { Product } from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollectionBySlug } from "@/features/wix/api/collections";
import { queryProducts } from "@/features/wix/api/products";
import { getWixServerClient } from "@/lib/wix-client-server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const wixServerClient = await getWixServerClient();
  const { slug } = await params;
  const collection = await getCollectionBySlug(wixServerClient, slug);
  if (!collection?._id) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense fallback={<LoadingSkeleton />}>
        <Products collectionId={collection._id} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const wixServerClient = await getWixServerClient();
  const { slug } = await params;
  const collection = await getCollectionBySlug(wixServerClient, slug);
  if (!collection) {
    return {};
  }

  const bannerImg = collection.media?.mainMedia?.image;
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: bannerImg
        ? [
            {
              url: bannerImg?.url,
            },
          ]
        : [],
    },
  };
}
interface ProductsProps {
  collectionId: string;
}

async function Products({ collectionId }: ProductsProps) {
  const wixServerClient = await getWixServerClient();
  const collectionProducts = await queryProducts(wixServerClient, {
    collectionIds: collectionId,
  });

  if (!collectionProducts.length) return null;

  return (
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {collectionProducts.items.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
}
