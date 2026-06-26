import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Outreach — MYOS AI",
  description: "Compose and send AI-powered cold emails to your leads.",
};

import { EmailComposerPage } from "@/components/outreach/EmailComposer";
export default function EmailPage() {
  return <EmailComposerPage />;
}
