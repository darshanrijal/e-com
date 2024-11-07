import { env } from "@/env";
import { WixClient } from "@/lib/wix-client.base";
import { OauthData } from "@wix/sdk";

export function generateOAuthData(wixClient: WixClient, originPath?: string) {
  return wixClient.auth.generateOAuthData(
    env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback/wix",
    env.NEXT_PUBLIC_BASE_URL + "/" + (originPath || ""),
  );
}

export async function getLoginUrl(wixClient: WixClient, OAuthData: OauthData) {
  const { authUrl } = await wixClient.auth.getAuthUrl(OAuthData, {
    responseMode: "query",
  });
  return authUrl;
}

export async function getLogoutUrl(wixClient: WixClient) {
  const { logoutUrl } = await wixClient.auth.logout(env.NEXT_PUBLIC_BASE_URL);
  return logoutUrl;
}
