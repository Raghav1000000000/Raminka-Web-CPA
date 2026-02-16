import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ramika Bahri - Professional Tax Services in Canada | Expert Tax Consultant",
  description: "Get expert personal tax support from Ramika Bahri, professional tax consultant in Canada. Secure document handling, clear communication, and comprehensive tax preparation services. Contact today for professional tax assistance.",
  keywords: [
    "tax services Canada",
    "personal tax preparation", 
    "CPA tax support",
    "Canadian tax returns",
    "tax consultation",
    "Ramika Bahri",
    "professional tax help",
    "secure tax services"
  ],
  authors: [{ name: "Ramika Bahri" }],
  openGraph: {
    title: "Ramika Bahri - Professional Tax Services in Canada",
    description: "Expert personal tax support with secure document handling and clear communication. Get professional tax preparation services from tax consultant Ramika Bahri.",
    type: "website",
    locale: "en_CA"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen selection:bg-blue-100 selection:text-blue-900`}
      >
        {children}
      </body>
    </html>
  );
}
