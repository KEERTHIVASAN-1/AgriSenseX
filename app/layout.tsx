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
  title: "AgriSmartX Dashboard",
  description: "Smart farm device monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* App shell – full-width on mobile, centered max-width on larger screens */}
        {/* <div className="min-h-screen bg-black flex justify-center"> */}
          {/* <div className="w-full max-w-5xl bg-[#111318] text-white shadow-2xl"> */}
            {children}
          {/* </div> */}
        {/* </div> */}
      </body>
    </html>
  );
}
