import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LunaParkHeader from "../components/LunaParkHeader";
import Cart from "../components/Cart";
import { CartProvider } from "../contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brevia = localFont({
  src: "../public/fonts/fonnts.com-Brevia_Regular.otf",
  variable: "--font-brevia",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amusement  & Theme Park in Sydney | Luna Park Sydney",
  description: "A fun and exciting amusement park in Sydney, Australia. Offering a variety of rides and attractions for all ages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${brevia.variable} antialiased`}
      >
        <CartProvider>
          <LunaParkHeader />
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
