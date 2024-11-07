import { WIX_SESSION_COOKIE } from "@/constansts";
import { Tokens } from "@wix/sdk";
import cookieStore from "js-cookie";
import { getWixClient } from "./wix-client.base";

const tokens: Tokens = JSON.parse(cookieStore.get(WIX_SESSION_COOKIE) || "{}");

export const wixBrowserClient = getWixClient(tokens);
