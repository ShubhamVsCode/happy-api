import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Happy API",
  description: "Helping startups to move fast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SessionProvider>
          {children}
          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
