import Logo from "@/assets/logo.png";
import { getCart } from "@/features/wix/api/cart";
import { getWixServerClient } from "@/lib/wix-client-server";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartButton } from "./ShoppingCartButton";
import { UserButton } from "@/components/UserButton";
import { getLoggedInMember } from "@/features/wix/api/members";
import { getCollections } from "@/features/wix/api/collections";
import { MainNavigation } from "@/components/MainNavigation";
import { SearchField } from "@/components/SearchField";
import { MobileMenu } from "./mobile-menu";
import { Suspense } from "react";

export const Navbar = async () => {
  const wixServerClient = await getWixServerClient();

  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixServerClient),
    getLoggedInMember(wixServerClient),
    getCollections(wixServerClient),
  ]);

  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5">
        <Suspense>
          <MobileMenu
            collections={collections}
            loggedInMember={loggedInMember}
          />
        </Suspense>
        <div className="flex flex-wrap items-center gap-5">
          <Link href={"/"} className="flex items-center gap-4">
            <Image src={Logo} alt="flow shop" width={40} height={40} />
            <span className="text-xl font-bold">Flow shop</span>
          </Link>
          <MainNavigation
            collections={collections}
            className="hidden lg:flex"
          />
        </div>
        <SearchField className="hidden max-w-96 lg:inline" />
        <div className="flex items-center justify-center gap-5">
          <UserButton
            loggedInMember={loggedInMember}
            className="hidden lg:inline-flex"
          />
          <ShoppingCartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
};
