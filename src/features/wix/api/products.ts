import { getWixClient } from "@/lib/wix-client.base";

interface QueryProductsFilter {
  collectionIds?: string | string[];
  sort?: ProductsSort;
}
type ProductsSort = "last_updated" | "price_asc" | "price_desc";
export async function queryProducts({
  sort = "last_updated",
  collectionIds,
}: QueryProductsFilter) {
  const wixClient = getWixClient();
  let query = wixClient.products.queryProducts();

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
  }

  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;

    case "price_desc":
      query = query.descending("price");
      break;
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
  }

  return query.find();
}
