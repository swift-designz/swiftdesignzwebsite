"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import CookieConsent from "@/app/components/ui/CookieConsent";
import BackgroundEffects from "@/app/components/ui/BackgroundEffects";
import SplashScreen from "@/app/components/ui/SplashScreen";
import FunButton from "@/app/components/fun/FunButton";
import TetrisButton from "@/app/components/fun/TetrisButton";
import ClickTracker from "@/app/components/ui/ClickTracker";
import ScrollToTop from "@/app/components/ui/ScrollToTop";
import AnnouncementPopup from "@/app/components/ui/AnnouncementPopup";

/** Pages that should render without the global site chrome (nav/footer/effects). */
const STANDALONE_ROUTES = ["/links"];

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isStandalone) {
    return (
      <>
        <main className="relative">{children}</main>
      <CookieConsent />
      </>
    );
  }

  return (
    <>
      <SplashScreen />
      <BackgroundEffects />
      <Navbar />
      <main className="relative">{children}</main>
      <Footer />
      <CookieConsent />
      <AnnouncementPopup />
      <FunButton />
      <TetrisButton />
      <ClickTracker />
      <ScrollToTop />
    </>
  );
}
