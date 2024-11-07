import { Tokens } from "@wix/sdk";
import { getWixClient } from "./wix-client.base";
import { cookies } from "next/headers";
import { WIX_SESSION_COOKIE } from "@/constansts";
import { cache } from "react";

export const getWixServerClient = cache(async () => {
  const cookieStore = await cookies();
  let tokens: Tokens | undefined;
  try {
    tokens = JSON.parse(cookieStore.get(WIX_SESSION_COOKIE)?.value || "{}");
  } catch (error) {}
  return getWixClient(tokens);
});
