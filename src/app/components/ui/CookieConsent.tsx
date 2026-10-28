"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import Link from "next/link";
import { Shield, X } from "lucide-react";
import { onSplashDone } from "@/app/components/ui/SplashScreen";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("swift-cookie-consent");
    if (consent) return;

    // Show 5 seconds after the splash screen finishes (straight after load if there was no splash).
    let timer: ReturnType<typeof setTimeout>;
    const stop = onSplashDone(() => {
      timer = setTimeout(() => setShow(true), 5000);
    });

    return () => {
      stop();
      clearTimeout(timer);
    };
  }, []);

  const accept = () => {
    Cookies.set("swift-cookie-consent", "accepted", { expires: 365 });
    setShow(false);
  };

  const decline = () => {
    Cookies.set("swift-cookie-consent", "declined", { expires: 365 });
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[200] p-6 rounded-2xl"
          style={{ background: "#1a1a1a", border: "1px solid rgba(48, 176, 176, 0.3)" }}
        >
          <button
            onClick={decline}
            className="absolute top-3 right-3 text-gray-600 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-4">
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ background: "rgba(48, 176, 176, 0.1)" }}
            >
              <Shield size={20} color="var(--swift-teal)" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Cookie Notice
              </h4>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience and remember your preferences.
                Read our{" "}
                <Link href="/cookies" className="text-[var(--swift-teal)] hover:underline">
                  Cookie Policy
                </Link>{" "}
                for more details.
              </p>
              <div className="flex gap-3">
                <button onClick={accept} className="neon-btn !py-2 !px-4 text-xs">
                  Accept
                </button>
                <button
                  onClick={decline}
                  className="text-xs text-gray-400 hover:text-white transition-colors py-2 px-4"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
