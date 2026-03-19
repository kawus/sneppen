import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Sneppen — A Forest Cabin Retreat",
  description:
    "Escape to Sneppen, a luxury cabin nestled deep in the Nordic forest. Book your private retreat.",
  openGraph: {
    title: "Sneppen — A Forest Cabin Retreat",
    description:
      "Escape to Sneppen, a luxury cabin nestled deep in the Nordic forest.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cabin-dark text-cabin-cream">
        {children}
      </body>
    </html>
  );
}
