import { getCollections } from "@/features/wix/api/collections";
import { getWixServerClient } from "@/lib/wix-client-server";
import { SearchFilterLayout } from "./_components/SearchFilterLayout";

export default async function Layout({ children }: PropsWithChildren) {
  const wixServerClient = await getWixServerClient();
  const collections = await getCollections(wixServerClient);
  return (
    <SearchFilterLayout collections={collections}>
      {children}
    </SearchFilterLayout>
  );
}
