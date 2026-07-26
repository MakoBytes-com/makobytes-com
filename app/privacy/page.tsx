import type { Metadata } from "next";
import OSApp from "@/components/os/OSApp";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "The MakoBytes privacy policy — what little we collect, and how we handle it. Opens as privacy.txt in MakoOS.",
  alternates: { canonical: "https://makobytes.com/privacy" },
};

export default function PrivacyPage() {
  return <OSApp initialOpen="privacy" trackPage="/privacy" />;
}
