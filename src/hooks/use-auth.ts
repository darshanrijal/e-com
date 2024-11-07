import { usePathname } from "next/navigation";
import { toast } from "./use-toast";
import {
  generateOAuthData,
  getLoginUrl,
  getLogoutUrl,
} from "@/features/wix/api/auth";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import cookieStore from "js-cookie";
import { WIX_OAUTH_COOKIE, WIX_SESSION_COOKIE } from "@/constansts";

export function useAuth() {
  const pathname = usePathname();
  async function login() {
    try {
      const oauthData = generateOAuthData(wixBrowserClient, pathname);
      cookieStore.set(WIX_OAUTH_COOKIE, JSON.stringify(oauthData), {
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 60 * 10 * 1000),
      });
      const redirectUrl = await getLoginUrl(wixBrowserClient, oauthData);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to login, Please try again",
      });
    }
  }
  async function logout() {
    try {
      const logoutUrl = await getLogoutUrl(wixBrowserClient);
      cookieStore.remove(WIX_SESSION_COOKIE);
      window.location.href = logoutUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to logout, Please try again",
      });
    }
  }
  return { login, logout };
}
