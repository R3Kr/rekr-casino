import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbars from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "REKr Casino",
  description: "This is legal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={inter.className + " bg-slate-800"}>
          <Navbars></Navbars>
          {children}
          <Analytics />
        </body>
      </html>
  );
}
