"use client";

import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

// ─── FUTURE: Disclaimer + warp + slider phases (commented out for future use) ─
// Restore these imports and code blocks to bring back the full multi-step splash.
//
// import { useRef } from "react";
// import { useMotionValue, useTransform } from "framer-motion";
// import Image from "next/image";
//
// type Phase = "disclaimers" | "warp" | "main" | "unlocked";
//
// const WARP_DELAYS = Array.from({ length: 24 }, () => Math.random() * 0.3);
//
// const DISCLAIMERS = [
//   {
//     num: "1 of 3", color: "#30B0B0", glow: "rgba(48,176,176,0.25)", border: "rgba(48,176,176,0.4)",
//     title: "WARNING",
//     body: [
//       "This website contains dangerously good design.",
//       "Side effects include spontaneous rebranding,",
//       "an uncontrollable urge to hire us immediately,",
//       "and permanent dissatisfaction with mediocre websites.",
//     ],
//     cta: "I'll Take My Chances →",
//   },
//   {
//     num: "2 of 3", color: "#ef4444", glow: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.4)",
//     title: "CAUTION: DESIGN HAZARD",
//     body: [
//       "We accept no liability for:",
//       "• Sudden clarity about your brand identity",
//       "• Inexplicable urge to fire your current web developer",
//       "• Realising your old website was a digital war crime",
//     ],
//     cta: "Understood. Proceed →",
//   },
//   {
//     num: "3 of 3", color: "#30B0B0", glow: "rgba(48,176,176,0.2)", border: "rgba(48,176,176,0.4)",
//     title: "TERMS & CONDITIONS (ABRIDGED)",
//     body: [
//       "By entering, you acknowledge that:",
//       "→  Your design standards are about to permanently level up",
//       "→  You may never look at Comic Sans the same way again",
//       "→  We warned you. You chose this.",
//     ],
//     cta: "Enter At Your Own Risk →",
//   },
// ];
//
// function WarpAnimation() { ... } // full warp streak + flash animation
// function CloudLayer({ onDone }: { onDone: () => void }) { ... } // parting clouds
//
// Slider (in main phase):
// const constraintsRef = useRef<HTMLDivElement>(null);
// const [windowWidth, setWindowWidth] = useState(0);
// const x = useMotionValue(0);
// const sliderWidth = windowWidth < 400 ? 220 : 280;
// const thumbWidth = windowWidth < 400 ? 52 : 64;
// const maxDrag = sliderWidth - thumbWidth;
// const backgroundOpacity = useTransform(x, [0, maxDrag], [0, 1]);
// const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);
// const handleDragEnd = () => {
//   if (x.get() >= maxDrag * 0.85) {
//     setPhase("unlocked");
//     Cookies.set("swift-splash-seen", "true", { expires: 1 });
//     localStorage.setItem("swift-splash-seen", "true");
//     setTimeout(() => { setShow(false); document.body.style.overflow = ""; document.body.style.paddingRight = ""; }, 4800);
//   }
// };
// ─────────────────────────────────────────────────────────────────────────────

const BURST_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  w: Math.random() * 6 + 3,
  h: Math.random() * 6 + 3,
  x: Math.cos((i / 16) * Math.PI * 2) * (120 + Math.random() * 80),
  y: Math.sin((i / 16) * Math.PI * 2) * (120 + Math.random() * 80),
}));

const STARS = Array.from({ length: 40 }, () => ({
  w: Math.random() * 2.5 + 0.5,
  h: Math.random() * 2.5 + 0.5,
  l: Math.random() * 100,
  t: Math.random() * 100,
  o: Math.random() * 0.5 + 0.1,
  dur: Math.random() * 4 + 2,
  del: Math.random() * 4,
}));

/** Fires when splash is done (or skipped) so CookieConsent can start its 5s countdown. */
function fireSplashDone() {
  if (typeof window !== "undefined") {
    // The flag lets components that attach their listener after this point still know.
    (window as Window & { __swiftSplashDone?: boolean }).__swiftSplashDone = true;
    window.dispatchEvent(new Event("swift-splash-done"));
  }
}

/** Runs `cb` once the splash screen has finished (straight away if it already has). */
export function onSplashDone(cb: () => void): () => void {
  if ((window as Window & { __swiftSplashDone?: boolean }).__swiftSplashDone) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("swift-splash-done", handler, { once: true });
  return () => window.removeEventListener("swift-splash-done", handler);
}

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isInAppBrowser = /FBAN|FBAV|Instagram|FB_IAB/.test(ua);
    const params = new URLSearchParams(window.location.search);
    const isAdTraffic =
      params.has("fbclid") ||
      params.has("utm_source") ||
      params.has("utm_medium") ||
      params.has("gclid");
    const seenCookie = Cookies.get("swift-splash-seen");
    const seenLocal = localStorage.getItem("swift-splash-seen");
    const shouldShow = !isInAppBrowser && !isAdTraffic && !seenCookie && !seenLocal;

    startTransition(() => {
      setMounted(true);
      if (shouldShow) setShow(true);
    });

    if (shouldShow) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      Cookies.set("swift-splash-seen", "true", { expires: 1 });
      localStorage.setItem("swift-splash-seen", "true");

      // Auto-dismiss after 3.5s then fire done event for CookieConsent
      const dismissTimer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        fireSplashDone();
      }, 3500);

      return () => clearTimeout(dismissTimer);
    } else {
      // No splash — fire immediately so CookieConsent can start its 5s timer
      fireSplashDone();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Before useEffect resolves we don't yet know if splash is needed.
  // Render a blocking dark overlay so the home page never flashes through.
  if (!mounted) {
    return <div className="fixed inset-0 z-[9999]" style={{ background: "#060a10" }} />;
  }

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#060a10" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Zooming background grid */}
          <motion.div
            className="absolute inset-[-15%] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(48,176,176,0.055) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
            animate={{ scale: [1, 1.38, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Starfield backdrop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {STARS.map((star, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: star.w,
                  height: star.h,
                  left: `${star.l}%`,
                  top: `${star.t}%`,
                  background: "white",
                  opacity: star.o,
                }}
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{ duration: star.dur, repeat: Infinity, delay: star.del }}
              />
            ))}
          </div>

          {/* ── Welcome screen ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Burst particles */}
            {BURST_PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.w,
                  height: p.h,
                  background: i % 2 === 0 ? "var(--swift-teal)" : "white",
                  left: "50%",
                  top: "50%",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            ))}

            {/* Spinning favicon */}
            <motion.img
              src="/images/favicon.png"
              alt=""
              className="w-24 h-24 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              style={{ filter: "drop-shadow(0 0 20px rgba(48,176,176,0.8))" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[4px] text-[var(--swift-teal)] mb-4"
            >
              Welcome to
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
              className="text-2xl md:text-3xl font-bold text-center mb-3 leading-snug"
              style={{
                background: "linear-gradient(135deg, #fff 0%, var(--swift-teal) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Magical Design World
            </motion.h2>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 150 }}
              className="text-3xl md:text-4xl font-black text-center"
              style={{
                background: "linear-gradient(135deg, var(--swift-teal), #7ef5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              of Swift Designz
            </motion.h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
