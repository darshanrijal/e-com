import { getProductBySlug } from "@/features/wix/api/products";
import { notFound } from "next/navigation";
import { ProductDetails } from "../_components/product-details";
import { Metadata } from "next";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product?._id) {
    notFound();
  }
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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
