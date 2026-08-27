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
  title: "Deelo-Tech | SmartCollar - Precision Livestock Monitoring",
  description: "Precision behavioral classification and physiological tracking for Yankasa and Ouda flocks using TinyML and NB-IoT at the edge. Developed in affiliation with FUT Minna.",
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
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-zinc-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
