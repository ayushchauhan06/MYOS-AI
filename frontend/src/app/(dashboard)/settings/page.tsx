import type { Metadata } from "next";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings — MYOS AI",
  description: "Manage your MYOS AI profile, workspace, AI settings, and billing.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
