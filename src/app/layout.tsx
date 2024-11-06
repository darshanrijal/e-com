import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "./_components/navbar";
import Footer from "./_components/footer";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Flow shop",
    absolute: "Flow shop",
  },
  description: "A full stack e-commerece built with NextJS 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <NextTopLoader showSpinner={false} color="hsl(var(--primary))" />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
