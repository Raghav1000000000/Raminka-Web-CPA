import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ramika Bahri - Professional Tax Services in Canada | Aspiring CPA",
  description: "Get expert personal tax support from Ramika Bahri, aspiring CPA in Canada. Secure document handling, clear communication, and comprehensive tax preparation services. Contact today for professional tax assistance.",
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
    description: "Expert personal tax support with secure document handling and clear communication. Get professional tax preparation services from aspiring CPA Ramika Bahri.",
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
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
