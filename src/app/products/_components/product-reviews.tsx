"use client";
import Logo from "@/assets/logo.png";
import { LoadingButton } from "@/components/LoadingButton";
import { Skeleton } from "@/components/ui/skeleton";
import { WixImage } from "@/components/WixImage";
import { getProductReviews } from "@/features/review/api/reviews";
import { cn } from "@/lib/utils";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import { CornerDownRightIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import { media as wixMedia } from "@wix/sdk";

export const ProductReviews = ({ product }: { product: products.Product }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isPending,
    error,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["product-reviews", product._id],
    queryFn: async ({ pageParam }) => {
      if (!product._id) {
        throw new Error("Product id missing");
      }
      const pagesize = 2;
      return getProductReviews(wixBrowserClient, {
        productId: product._id,
        limit: pagesize,
        cursor: pageParam,
      });
    },
    select(data) {
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter(
            (item) => item.moderation?.moderationStatus === "APPROVED",
          ),
        })),
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastpage) => lastpage.cursors.next,
  });

  const reviewItems = data?.pages.flatMap((page) => page.items) || [];
  return (
    <div className="space-y-5">
      {isPending && <ProductReviewsLoadingSkeleton />}
      {error && <p className="text-destructive">Error fetching reviews</p>}
      {isSuccess && !reviewItems.length && !hasNextPage && (
        <p>No reviews yet</p>
      )}

      <div className="divide-y">
        {reviewItems.map((review) => (
          <Review key={review._id} review={review} />
        ))}
      </div>
      {hasNextPage && (
        <LoadingButton
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more reviews
        </LoadingButton>
      )}
    </div>
  );
};

export function ProductReviewsLoadingSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="space-y-1.5" key={i}>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-72" />
        </div>
      ))}
    </div>
  );
}

function Review({
  review: { author, reviewDate, content, reply },
}: {
  review: reviews.Review;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "size-5 text-primary",
                i < (content?.rating || 0) && "fill-primary",
              )}
            />
          ))}
          {content?.title && <h3 className="font-bold">{content.title}</h3>}
        </div>
        <p className="text-sm text-muted-foreground">
          by {author?.authorName ?? "Someone"}
          {reviewDate && <> on {new Date(reviewDate).toLocaleDateString()}</>}
        </p>
        {content?.body && (
          <div className="whitespace-pre-line">{content.body}</div>
        )}
        {!!content?.media?.length && (
          <div className="flex flex-wrap gap-2">
            {content.media.map((media) => (
              <MediaAttachment key={media.image || media.video} media={media} />
            ))}
          </div>
        )}
      </div>
      {reply?.message && (
        <div className="ms-10 mt-2.5 space-y-1 border-t pt-2.5">
          <div className="flex items-center gap-2">
            <CornerDownRightIcon className="size-5" />
            <Image
              src={Logo}
              alt="shop_logo"
              width={24}
              height={24}
              className="size-5"
            />
            <span className="font-bold">Flowshop Team</span>
          </div>
          <div className="whitespace-pre-line">{reply.message}</div>
        </div>
      )}
    </div>
  );
}

function MediaAttachment({ media }: { media: reviews.Media }) {
  if (media.image) {
    return (
      <Zoom>
        <WixImage
          mediaIdentifier={media.image}
          alt={"Review media"}
          scaleToFill={false}
          className="max-h-40 max-w-40 object-contain"
        />
      </Zoom>
    );
  }

  if (media.video) {
    return (
      <video controls className="max-h-40 max-w-40">
        <source src={wixMedia.getVideoUrl(media.video).url} type="video/mp4" />
      </video>
    );
  }
  return <span className="text-destructive">Unsupported media type</span>;
}
