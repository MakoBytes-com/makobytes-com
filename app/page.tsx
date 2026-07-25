import type { Metadata } from "next";
import { TrackPageView } from "@/components/admin/track-pageview";
import Desktop from "@/components/os/Desktop";
import {
  CertificateContent,
  ContactContent,
  MakoBotContent,
  PixelCopyContent,
  ReadmeContent,
  WallpapersContent,
  WelcomeContent,
} from "@/components/os/window-contents";

export const metadata: Metadata = {
  title: "MakoBytes — a Desktop Software Studio, Running on Your Screen",
  description:
    "MakoBytes builds small, sharp Windows apps for AI power users — PixelCopy and MakoBot. The site is MakoOS: boot it, open the catalog, check the signature, take a free wallpaper. Signed, on-device, fast. No BS.",
  alternates: { canonical: "https://makobytes.com" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com",
    title: "MakoBytes — a Desktop Software Studio, Running on Your Screen",
    description: "The catalog ships installed. Boot MakoOS and open it.",
    siteName: "MakoBytes",
  },
};

export default function MakoOSHome() {
  return (
    <>
      <TrackPageView type="pageview_home" page="/" />
      {/* JSON-LD: Organization + the two products */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "MakoBytes",
                url: "https://makobytes.com",
                description:
                  "MakoBytes builds lightweight, private desktop tools for people who live in AI workflows.",
              },
              {
                "@type": "SoftwareApplication",
                name: "PixelCopy",
                operatingSystem: "Windows 10, Windows 11",
                applicationCategory: "UtilitiesApplication",
                url: "https://pixelcopy.app",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@type": "SoftwareApplication",
                name: "MakoBot",
                operatingSystem: "Windows 10, Windows 11",
                applicationCategory: "DeveloperApplication",
                url: "https://makobot.com",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <Desktop
        contents={{
          welcome: <WelcomeContent />,
          pixelcopy: <PixelCopyContent />,
          makobot: <MakoBotContent />,
          certificate: <CertificateContent />,
          readme: <ReadmeContent />,
          wallpapers: <WallpapersContent />,
          contact: <ContactContent />,
        }}
      />
    </>
  );
}
