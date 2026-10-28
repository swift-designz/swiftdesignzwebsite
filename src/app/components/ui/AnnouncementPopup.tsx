"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { trackEvent } from "@/lib/analytics";
import { onSplashDone } from "@/app/components/ui/SplashScreen";

/**
 * The current announcement, shown once on the home page. To announce something
 * new, change `id` (so people who closed the old one see it) and the `announce.*`
 * strings in src/messages/*.json.
 */
const ANNOUNCEMENT = {
  id: "hiremebuddy-waitlist-2026-10",
  href: "https://hiremebuddy.swiftdesignz.co.za/?utm_source=swiftdesignz&utm_medium=popup&utm_campaign=waitlist#waitlist",
};
const STORAGE_KEY = "swift-announcement-closed";

export default function AnnouncementPopup() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    // Leave visitors from ads to the page they came for, as the splash screen does.
    const params = new URLSearchParams(window.location.search);
    if (["fbclid", "utm_source", "utm_medium", "gclid"].some((p) => params.has(p))) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === ANNOUNCEMENT.id) return;
    } catch {
      // Storage blocked: still show it once for this page view.
    }
    let timer: ReturnType<typeof setTimeout>;
    const stop = onSplashDone(() => {
      timer = setTimeout(() => setShow(true), 1500);
    });
    return () => {
      stop();
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close("escape");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function remember() {
    try {
      localStorage.setItem(STORAGE_KEY, ANNOUNCEMENT.id);
    } catch {
      // Storage blocked: nothing to remember.
    }
  }

  function close(how: string) {
    remember();
    setShow(false);
    trackEvent("announcement_close", "announcement", `${ANNOUNCEMENT.id}:${how}`);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(6, 10, 16, 0.72)", backdropFilter: "blur(6px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => close("backdrop")}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="announce-title"
            className="glass-strong relative w-full max-w-lg overflow-hidden rounded-3xl"
            style={{
              border: "1px solid rgba(48, 176, 176, 0.35)",
              boxShadow: "0 0 0 1px rgba(217,119,6,0.08) inset, 0 0 60px rgba(48,176,176,0.18)",
            }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => close("x")}
              aria-label={t("announce.close")}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-end gap-2 px-6 pt-6 sm:px-8">
              <Image
                src="/images/hiremebuddy/buddy-wave.webp"
                alt={t("announce.mascotAlt")}
                width={110}
                height={173}
                className="-mb-1 h-auto w-[92px] shrink-0 sm:w-[110px]"
              />
              <div className="pb-4">
                <span className="text-xs uppercase tracking-[4px] text-[#d97706]">{t("announce.eyebrow")}</span>
                <div className="mt-2 flex items-center gap-2">
                  <Image src="/images/hiremebuddy/logo.png" alt="" width={28} height={28} className="rounded-lg" />
                  <span className="font-semibold text-white">HireMeBuddy™</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[rgba(48,176,176,0.15)] px-6 pb-7 pt-5 sm:px-8">
              <h2 id="announce-title" className="mb-3 text-2xl font-bold leading-tight sm:text-3xl">
                {t("announce.title")} <span className="text-gradient">{t("announce.titleHighlight")}</span>
              </h2>
              <p className="mb-6 leading-relaxed text-gray-400">{t("announce.body")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  ref={ctaRef}
                  href={ANNOUNCEMENT.href}
                  target="_blank"
                  rel="noopener"
                  className="neon-btn-filled neon-btn"
                  onClick={() => {
                    remember();
                    setShow(false);
                    trackEvent("announcement_click", "announcement", ANNOUNCEMENT.id);
                  }}
                >
                  {t("announce.cta")} <ArrowRight size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => close("later")}
                  className="px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {t("announce.later")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
