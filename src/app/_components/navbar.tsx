import { getWixClient } from "@/lib/wix-client.base";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import Image from "next/image";

export const Navbar = async () => {
  const cart = await getCart();
  const totalQuantity =
    cart?.lineItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0;
  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5">
        <Link href={"/"} className="flex items-center gap-4">
          <Image src={Logo} alt="flow shop" width={40} height={40} />
          <span className="text-xl font-bold">Flow shop</span>
        </Link>
        {totalQuantity} items in your cart
      </div>
    </header>
  );
};

async function getCart() {
  const wixClient = getWixClient();
  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as OWNED_CART_NOT_FOUND_Error).details.applicationError.code ===
      "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    }

    throw error;
  }
}
