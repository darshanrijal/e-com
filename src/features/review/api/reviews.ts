import { getLoggedInMember } from "@/features/wix/api/members";
import { WixClient } from "@/lib/wix-client.base";

export interface CreateProductReviewValues {
  productId: string;
  title: string;
  body: string;
  rating: number;
  media: { url: string; type: "image" | "video" }[];
}

export async function createProductReview(
  wixClient: WixClient,
  { body, productId, rating, title, media }: CreateProductReviewValues,
) {
  const member = await getLoggedInMember(wixClient);

  if (!member) {
    throw Error("Must be logged in to create a review");
  }

  const authorName =
    member.contact?.firstName && member.contact.lastName
      ? `${member.contact.firstName} ${member.contact.lastName}`
      : member.contact?.firstName ||
        member.contact?.lastName ||
        member.profile?.nickname ||
        "Anonymous";

  return wixClient.reviews.createReview({
    author: {
      authorName,
      contactId: member.contactId,
    },

    entityId: productId,
    namespace: "stores",
    content: {
      title,
      body,
      rating,
      media: media.map(({ url, type }) =>
        type === "image" ? { image: url } : { video: url },
      ),
    },
  });
}

interface GetProductReviewsFilters {
  productId: string;
  contactId?: string;
  limit?: number;
  cursor?: string | null;
}

export async function getProductReviews(
  wixClient: WixClient,
  { productId, contactId, cursor, limit }: GetProductReviewsFilters,
) {
  let query = wixClient.reviews.queryReviews().eq("entityId", productId);
  if (contactId) {
    query = query.eq("author.contactId", contactId);
  }
  if (limit) {
    query = query.limit(limit);
  }
  if (cursor) {
    query = query.skipTo(cursor);
  }

  return query.find();
}
