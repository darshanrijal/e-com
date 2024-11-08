import { Product } from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProductReviewButton } from "@/features/review/components/CreateProductReviewButton";
import { getLoggedInMember } from "@/features/wix/api/members";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/wix/api/products";
import { getWixServerClient } from "@/lib/wix-client-server";
import { products } from "@wix/stores";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetails } from "../_components/product-details";
import {
  ProductReviews,
  ProductReviewsLoadingSkeleton,
} from "../_components/product-reviews";
import { getProductReviews } from "@/features/review/api/reviews";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();
  const product = await getProductBySlug(wixServerClient, slug);

  if (!product?._id) {
    notFound();
  }
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Buyer reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewSection product={product} />
        </Suspense>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();
  const product = await getProductBySlug(wixServerClient, slug);

  if (!product?._id) {
    return {};
  }

  const mainImage = product.media?.mainMedia?.image;
  return {
    title: product.name,
    description: "Get this product on flow shop",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}

async function RelatedProducts({ productId }: { productId: string }) {
  const wixServerClient = await getWixServerClient();

  const relatedProducts = await getRelatedProducts(wixServerClient, productId);

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-12 sm:grid lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
}

interface ProductReviewSectionSection {
  product: products.Product;
}
async function ProductReviewSection({ product }: ProductReviewSectionSection) {
  if (!product._id) {
    return null;
  }
  const wixServerClient = await getWixServerClient();

  const loggedInMember = await getLoggedInMember(wixServerClient);

  const existingReview = loggedInMember?.contactId
    ? (
        await getProductReviews(wixServerClient, {
          contactId: loggedInMember.contactId,
          productId: product._id,
        })
      ).items[0]
    : null;

  return (
    <div className="space-y-5">
      <CreateProductReviewButton
        product={product}
        loggedInMember={loggedInMember}
        hasExistingReview={!!existingReview}
      />
      <ProductReviews product={product} />
    </div>
  );
}
