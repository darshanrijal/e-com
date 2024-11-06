"use client";

import { Badge } from "@/components/ui/badge";
import { products } from "@wix/stores";
import { useState } from "react";
import { ProductOptions } from "./product-options";
import { checkInStock, findVariant } from "@/lib/utils";
import { ProductPrice } from "./ProductPrice";
import { ProductMedia } from "./ProductMedia";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductDetailsProps {
  product: products.Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption>(
    product.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0]?.description || "",
      }))
      .reduce(
        (acc, curr) => ({
          ...acc,
          ...curr,
        }),
        {} as SelectedOption,
      ) || {},
  );
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = findVariant(product, selectedOptions);
  const inStock = checkInStock(product, selectedOptions);
  const availabeQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity;

  const availabeQuantityExceeded =
    !!availabeQuantity && quantity > availabeQuantity;

  const selectedOpitionsMedia = product.productOptions?.flatMap((opt) => {
    const selectedChoice = opt.choices?.find(
      (choice) => choice.description === selectedOptions[opt.name || ""],
    );

    return selectedChoice?.media?.items ?? [];
  });
  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={
          !!selectedOpitionsMedia?.length
            ? selectedOpitionsMedia
            : product.media?.items
        }
      />
      <div className="basis-3/5 space-y-5">
        <div className="space-y-2.5">
          <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
          {product.brand && (
            <p className="text-muted-foreground">{product.brand}</p>
          )}
          {product.ribbon && <Badge className="block">{product.ribbon}</Badge>}
        </div>

        {product.description && (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose dark:prose-invert"
          />
        )}

        <ProductPrice product={product} selectedVariant={selectedVariant} />
        <ProductOptions
          product={product}
          {...{ selectedOptions, setSelectedOptions }}
        />

        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center gap-2.5">
            <Input
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24"
              min={1}
              disabled={!inStock}
            />
            {!!availabeQuantity &&
              availabeQuantityExceeded &&
              availabeQuantity < 10 && (
                <span className="text-destructive">
                  Only {availabeQuantity} left in stock
                </span>
              )}
          </div>
        </div>
        {!!product.additionalInfoSections?.length && (
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <InfoIcon className="size-5" />
              <span>Additional product information</span>
            </span>
            <Accordion type="multiple">
              {product.additionalInfoSections.map((section) => (
                <AccordionItem value={section.title || ""} key={section.title}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: section.description || "",
                      }}
                      className="prose dark:prose-invert text-sm text-muted-foreground"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};
