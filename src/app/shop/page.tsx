import { PaginationBar } from "@/components/PaginationBar";
import { Product } from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { queryProducts } from "@/features/wix/api/products";
import { getWixServerClient } from "@/lib/wix-client-server";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { page = "1", q } = await searchParams;
  const title = q ? `Results for "${q}"` : "Products";
  return (
    <main className="flex flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:items-start">
      <div>After sidebar</div>
      <div className="w-full max-w-7xl space-y-5">
        <div className="flex justify-center lg:justify-end">Sort filter</div>
        <div className="space-y-10">
          <h1 className="text-center text-3xl font-bold md:text-4xl">
            {title}
          </h1>

          <Suspense fallback={<LoadingSkeleton />} key={q + "-" + page}>
            <ProductResult q={q} page={parseInt(page)} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q } = await searchParams;
  return {
    title: q ? `Results for "${q}"` : "Products",
  };
}

interface ProductResultProps {
  q?: string;
  page: number;
}

async function ProductResult({ page, q }: ProductResultProps) {
  const pagesize = 8;
  const wixServerClient = await getWixServerClient();

  const products = await queryProducts(wixServerClient, {
    limit: pagesize,
    skip: (page - 1) * pagesize,
    q,
  });

  if (page > (products.totalPages || 1)) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <p className="text-center text-xl">
        {products.totalCount} product{(products.totalCount ?? 1) > 1 && "s"}
      </p>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {products.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="mx-auto h-9 w-52" />
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[26rem]" />
        ))}
      </div>
    </div>
  );
}
