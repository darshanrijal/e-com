import { formatCurrency } from "@/lib/utils";
import { products } from "@wix/stores";
import Link from "next/link";
import { DiscountBadge } from "./DiscountBadge";
import { WixImage } from "./WixImage";
import { Badge } from "./ui/badge";

interface ProductProps {
  product: products.Product;
}

export const Product = ({ product }: ProductProps) => {
  const mainImage = product.media?.mainMedia?.image;

  return (
    <Link href={`/products/${product.slug}`} className="h-full border bg-card">
      <div className="relative overflow-hidden">
        <WixImage
          mediaIdentifier={product.media?.mainMedia?.image?.url}
          alt={mainImage?.altText}
          height={700}
          width={700}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2">
          {product.ribbon && <Badge>{product.ribbon}</Badge>}
          {product.discount && <DiscountBadge discount={product.discount} />}
          <Badge className="bg-secondary font-semibold text-secondary-foreground">
            {getFormattedPrice(product)}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div
          dangerouslySetInnerHTML={{
            __html: product.description || "Product description",
          }}
          className="line-clamp-5"
        />
      </div>
    </Link>
  );
};

function getFormattedPrice(product: products.Product) {
  const minPrice = product.priceRange?.minValue;
  const maxPrice = product.priceRange?.maxValue;

  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `from ${formatCurrency(minPrice, product.priceData?.currency)}`;
  } else {
    return (
      product.priceData?.formatted?.discountedPrice ||
      product.priceData?.formatted?.price ||
      "N/A"
    );
  }
}
