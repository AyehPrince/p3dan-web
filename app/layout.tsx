import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://p3dan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "p3dan — Find rooms and apartments in Ghana",
    template: "%s",
  },
  description:
    "Search rooms and apartments to rent across Ghana by room type, area, and price — with transparent fees and verified listings.",
  openGraph: {
    type: "website",
    siteName: "p3dan",
    title: "p3dan — Find rooms and apartments in Ghana",
    description:
      "Search rooms and apartments to rent across Ghana by room type, area, and price — with transparent fees and verified listings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "p3dan — Find rooms and apartments in Ghana",
    description:
      "Search rooms and apartments to rent across Ghana by room type, area, and price.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${manrope.variable} font-body bg-canvas text-warmgray-900`}>
        {children}
      </body>
    </html>
  );
}