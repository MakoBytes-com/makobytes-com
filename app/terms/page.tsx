import type { Metadata } from "next";
import OSApp from "@/components/os/OSApp";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The MakoBytes terms of service — plain rules, no fine print. Opens as terms.txt in MakoOS.",
  alternates: { canonical: "https://makobytes.com/terms" },
};

export default function TermsPage() {
  return <OSApp initialOpen="terms" trackPage="/terms" />;
}
