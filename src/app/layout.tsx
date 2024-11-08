import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "./_components/navbar";
import Footer from "./_components/footer";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "./_components/ReactQueryProvider";
import { env } from "@/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Flow shop",
    absolute: "Flow shop",
  },
  description: "A full stack e-commerece built with NextJS 15",
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        <NextTopLoader showSpinner={false} color="hsl(var(--primary))" />
        <ReactQueryProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="min-h-[50vh]">{children}</div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
