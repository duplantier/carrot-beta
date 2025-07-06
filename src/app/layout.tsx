import { auth } from "@/auth";
import ClientProviders from "@/providers";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { urbanist } from "./fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carrot - Verify &Engage & Earn",
  description:
    "Web3-based community engagement tools for blockchain companies.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${urbanist.className}`}>
        <ClientProviders session={session}>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
