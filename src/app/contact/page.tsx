"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Clock, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";


function ContactForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(true);
  const [planeFly, setPlaneFly] = useState(false);
  const [planeKey, setPlaneKey] = useState(0);

  // Pre-fill message from ?package=&category= query params
  useEffect(() => {
    const pkg = searchParams.get("package");
    const category = searchParams.get("category");
    if (pkg) {
      const label = category ? `${category} – ${pkg}` : pkg;
      setFormState((s) => ({
        ...s,
        message: `Hi, I'm interested in the ${label} package. Please send me more details.`,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    setPlaneKey((k) => k + 1);
    setPlaneFly(true);
    setTimeout(() => setPlaneFly(false), 1800);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();
      setConfirmationSent(data.confirmationSent !== false);
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went sideways on our end. Please try again.");
    }
  };

  return (
    <>
      {/* Flying plane overlay */}
      <AnimatePresence>
        {planeFly && (
          <motion.div
            key={planeKey}
            className="fixed z-[9999] pointer-events-none"
            style={{ bottom: "45%", left: "50%", x: "-50%" }}
            initial={{ x: "-50%", y: 0, rotate: -30, opacity: 1, scale: 2 }}
            animate={{ x: "60vw", y: "-60vh", rotate: -45, opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Send
              size={36}
              color="var(--swift-teal)"
              style={{ filter: "drop-shadow(0 0 10px rgba(48,176,176,0.9))" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="section pt-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Spinning favicon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 flex justify-center"
            >
              <motion.img
                src="/images/favicon.png"
                alt="Swift Designz"
                className="w-[9.5rem] h-[9.5rem] md:w-48 md:h-48"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  filter: "drop-shadow(0 0 12px rgba(48, 176, 176, 0.4)) drop-shadow(0 0 24px rgba(48, 176, 176, 0.2))",
                }}
              />
            </motion.div>

            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">{t("contactPage.eyebrow")}</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              {t("contactPage.title")} <span className="text-gradient">{t("contactPage.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t("contactPage.desc")}{" "}
              {t("contactPage.descExtra")}{" "}
              <Link href="/quote" className="text-[var(--swift-teal)] hover:underline">
                {t("contactPage.quoteLink")}
              </Link>.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  icon: <Mail size={18} color="var(--swift-teal)" />,
                  title: t("contactPage.emailUs"),
                  content: (
                    <a
                      href="mailto:info@swiftdesignz.co.za"
                      className="text-sm text-gray-400 hover:text-[var(--swift-teal)] transition-colors block"
                    >
                      info@swiftdesignz.co.za
                    </a>
                  ),
                },
                {
                  icon: <Phone size={18} color="var(--swift-teal)" />,
                  title: "Call Us",
                  content: (
                    <>
                      <a href="tel:+264818536789" className="text-sm text-gray-400 hover:text-[var(--swift-teal)] transition-colors block">
                        NAM: +264 81 853 6789
                      </a>
                    </>
                  ),
                },
                {
                  icon: <MapPin size={18} color="var(--swift-teal)" />,
                  title: t("contactPage.location"),
                  content: (
                    <>
                      <p className="text-sm text-gray-400">{t("contactPage.locationValue")}</p>
                      <p className="text-xs text-gray-600 mt-1">{t("contactPage.locationSub")}</p>
                    </>
                  ),
                },
                {
                  icon: <Clock size={18} color="var(--swift-teal)" />,
                  title: t("contactPage.responseTime"),
                  content: (
                    <>
                      <p className="text-sm text-gray-400">{t("contactPage.within24")}</p>
                      <p className="text-xs text-gray-600 mt-1">{t("contactPage.hours")}</p>
                    </>
                  ),
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass glass-hover p-5 rounded-2xl"
                  style={{ border: "1px solid rgba(48,176,176,0.12)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(48,176,176,0.08)" }}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-semibold text-sm">{card.title}</h3>
                  </div>
                  {card.content}
                </motion.div>
              ))}

              {/* Quote CTA */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass p-5 rounded-2xl"
                style={{ border: "1px solid rgba(48,176,176,0.2)", background: "rgba(48,176,176,0.03)" }}
              >
                <p className="text-xs text-[var(--swift-teal)] uppercase tracking-wider mb-1">{t("contactPage.needPrice")}</p>
                <h3 className="text-sm font-bold mb-2">{t("contactPage.getQuoteTitle")}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {t("contactPage.getQuoteDesc")}
                </p>
                <Link
                  href="/quote"
                  className="neon-btn-filled neon-btn text-xs justify-center"
                  style={{ display: "flex" }}
                >
                  {t("contactPage.getQuoteBtn")} <ArrowRight size={13} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              {/* Electric border wrapper */}
              <div className="relative rounded-2xl overflow-hidden" style={{ padding: "1.5px" }}>
                <div
                  className="absolute"
                  style={{
                    width: "300%",
                    height: "300%",
                    top: "-100%",
                    left: "-100%",
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, #30B0B0 60deg, #7ef5f5 120deg, transparent 180deg, transparent 240deg, #509090 300deg, transparent 360deg)",
                    animation: "spinElectric 6s linear infinite",
                  }}
                />
                <form
                  onSubmit={handleSubmit}
                  className="relative rounded-[14px] space-y-6 p-6 md:p-8 lg:p-10"
                  style={{ background: "#0a0f1a" }}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("contactPage.formTitle")}</h3>
                    <p className="text-xs text-gray-500">
                      {t("contactPage.formSub")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t("contactPage.fullName")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all"
                        style={{ background: "rgba(16,16,16,0.6)", border: "1px solid rgba(48,176,176,0.12)" }}
                        placeholder={t("contactPage.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t("contactPage.emailAddr")}
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all"
                        style={{ background: "rgba(16,16,16,0.6)", border: "1px solid rgba(48,176,176,0.12)" }}
                        placeholder={t("contactPage.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">
                        {t("contactPage.message")}
                      </label>
                      <span className="text-xs text-gray-600">{formState.message.length} {t("contactPage.chars")}</span>
                    </div>
                    <textarea
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all resize-none"
                      style={{ background: "rgba(16,16,16,0.6)", border: "1px solid rgba(48,176,176,0.12)" }}
                      placeholder={t("contactPage.messagePlaceholder")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="neon-btn-filled neon-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("contactPage.sending")}
                      </>
                    ) : status === "success" ? (
                      <>
                        <CheckCircle size={16} />
                        {t("contactPage.sent")}
                      </>
                    ) : (
                      <>
                        {t("contactPage.sendMsg")}
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-lg"
                      style={confirmationSent
                        ? { background: "rgba(48,176,176,0.08)", border: "1px solid rgba(48,176,176,0.2)" }
                        : { background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.3)" }
                      }
                    >
                      <CheckCircle size={18} color={confirmationSent ? "var(--swift-teal)" : "#d97706"} className="flex-shrink-0" />
                      <p className={`text-sm ${confirmationSent ? "text-[var(--swift-teal)]" : "text-amber-400"}`}>
                        {t(confirmationSent ? "contactPage.successMsg" : "contactPage.confirmationWarning")}
                      </p>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(20,8,8,0.72)",
                        border: "1px solid rgba(255,80,80,0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          style={{
                            flexShrink: 0,
                            marginTop: 1,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(255,80,80,0.1)",
                            border: "1px solid rgba(255,80,80,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <AlertCircle size={15} color="#ff6464" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-0.5" style={{ color: "#ff7070" }}>Oops — something went wrong</p>
                          <p className="text-xs leading-relaxed" style={{ color: "#aa6060" }}>{errorMessage}</p>
                          <p className="text-xs mt-1.5" style={{ color: "#554444" }}>Double-check your details and try again. Still stuck? <a href="/contact" style={{ color: "#30B0B0", textDecoration: "none" }}>Open a direct inquiry</a>.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
