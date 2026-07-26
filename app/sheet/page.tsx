import type { Metadata } from "next";
import OSApp from "@/components/os/OSApp";

export const metadata: Metadata = {
  title: "The Spec Sheet — MakoBytes on Paper",
  description:
    "The MakoBytes catalog as a machinist's spec sheet — PixelCopy and MakoBot, dimensioned, stamped, and signed. Opens in the MakoOS document viewer.",
  alternates: { canonical: "https://makobytes.com/sheet" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com/sheet",
    title: "The Spec Sheet — MakoBytes on Paper",
    description: "The MakoBytes catalog, dimensioned and stamped.",
    siteName: "MakoBytes",
  },
};

export default function SheetPage() {
  return (
    <OSApp
      initialOpen="sheet"
      trackPage="/sheet"
      srTitle="MakoBytes — the spec sheet, paper edition"
    />
  );
}
