import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Sidebar } from "@/components/layout/sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noablo",
  description: "A collection of UI components crafted by a design engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body
        className={`${geistSans.className} min-h-full bg-background text-foreground`}
      >
        <div className="mx-auto flex min-h-full w-full max-w-4xl">
          <Sidebar />
          <main className="flex-1 px-16 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
