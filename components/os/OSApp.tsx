import { TrackPageView } from "@/components/admin/track-pageview";
import Desktop, { type WinId } from "@/components/os/Desktop";
import {
  CertificateContent,
  ContactContent,
  MakoBotContent,
  PixelCopyContent,
  PrivacyContent,
  ReadmeContent,
  SheetContent,
  TermsContent,
  WallpapersContent,
  WelcomeContent,
} from "@/components/os/window-contents";

/**
 * The whole site is one OS. Every route renders this shell; document
 * routes (/sheet, /privacy, /terms) just boot the desktop with that
 * window already open, so the URL still works for search engines,
 * bookmarks, and legal links — it's simply framed in MakoOS.
 */
export default function OSApp({
  initialOpen,
  trackType = "pageview",
  trackPage,
  srTitle,
}: {
  initialOpen?: WinId;
  trackType?: string;
  trackPage: string;
  srTitle?: string;
}) {
  return (
    <>
      <TrackPageView type={trackType} page={trackPage} />
      {srTitle ? <h1 className="sr-only">{srTitle}</h1> : null}
      <Desktop
        initialOpen={initialOpen}
        contents={{
          welcome: <WelcomeContent />,
          pixelcopy: <PixelCopyContent />,
          makobot: <MakoBotContent />,
          certificate: <CertificateContent />,
          readme: <ReadmeContent />,
          wallpapers: <WallpapersContent />,
          contact: <ContactContent />,
          sheet: <SheetContent />,
          privacy: <PrivacyContent />,
          terms: <TermsContent />,
        }}
      />
    </>
  );
}
