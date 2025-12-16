import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "WhoseTheGif | Premium Gif Collection",
  description: "Discover and share high-quality GIFs in a premium interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} antialiased bg-black text-white selection:bg-purple-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
