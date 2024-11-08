"use client";

import { LoadingButton } from "@/components/LoadingButton";
import { Order } from "@/components/Order";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserOrders } from "@/features/wix/api/orders";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const Orders = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: async ({ pageParam }) =>
      getUserOrders(wixBrowserClient, {
        cursor: pageParam,
        limit: 2,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.metadata?.cursors?.next,
  });

  if (isPending) {
    return <OrdersLoadingSkeleton />;
  }
  if (error) {
    console.error(error);
    return (
      <p className="text-center text-destructive">
        An error occured while loading orders
      </p>
    );
  }
  const orders = data.pages.flatMap((page) => page.orders);
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Your orders</h2>
      {orders.map((order) => (
        <Order key={order.number} order={order} />
      ))}
      {hasNextPage && (
        <LoadingButton
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more orders
        </LoadingButton>
      )}
      {!orders.length && <p>Place an order or find it here</p>}
    </div>
  );
};

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  );
}
