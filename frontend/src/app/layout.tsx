import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MYOS AI — AI-Powered Freelancer Operating System",
    template: "%s — MYOS AI",
  },
  description:
    "MYOS AI is the premium AI-powered operating system for freelancers. Automate lead generation, outreach, proposals, and campaigns with the power of AI.",
  keywords: ["AI", "freelancer", "CRM", "lead generation", "automation", "SaaS"],
  openGraph: {
    title: "MYOS AI",
    description: "AI-Powered Freelancer Operating System",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
