"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ArrowUpRight, Phone, Facebook, Instagram } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const footerLinks = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Packages", href: "/packages" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services#web" },
      { label: "E-Commerce", href: "/services#ecommerce" },
      { label: "Apps & Software", href: "/services#apps" },
      { label: "PM Training", href: "/services#training" },
      { label: "AI Training", href: "/services#ai" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export default function Footer() {
  const { t } = useI18n();
  const linkKeys: Record<string, string> = {
    "/": "footer.home",
    "/about": "footer.about",
    "/services": "footer.services",
    "/packages": "footer.packages",
    "/portfolio": "footer.portfolio",
    "/contact": "footer.contact",
    "/services#web": "footer.webDev",
    "/services#ecommerce": "footer.ecommerce",
    "/services#apps": "footer.apps",
    "/services#training": "footer.pmTraining",
    "/services#ai": "footer.aiTraining",
    "/privacy": "footer.privacy",
    "/terms": "footer.terms",
    "/cookies": "footer.cookies",
  };
  const sectionTitleKeys: Record<string, string> = {
    Navigate: "footer.navigate",
    Services: "footer.services",
    Legal: "footer.legal",
  };
  return (
    <footer className="relative border-t border-[rgba(48,176,176,0.1)]">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/images/logo.png"
                alt="Swift Designz"
                width={200}
                height={60}
                className="w-32 object-contain"
              />
            </div>
            <p className="text-sm" style={{ color: "hsl(180, 78%, 51%)", maxWidth: "20rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
              {t("footer.tagline")}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@swiftdesignz.co.za"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-[var(--swift-teal)] transition-colors"
              >
                <Mail size={14} />
                info@swiftdesignz.co.za
              </a>
              <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(180, 9%, 91%)" }}>
                <MapPin size={14} />
                {t("footer.location")}
              </div>
              <a href="tel:+264813881111" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[var(--swift-teal)] transition-colors">
                <Phone size={14} />
                NAM: +264 81 388 1111
              </a>
              <a href="tel:+27762557783" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[var(--swift-teal)] transition-colors">
                <Phone size={14} />
                SA: +27 76 255 7783
              </a>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=61589116923728"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[var(--swift-teal)] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://www.instagram.com/swiftdesignz101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[var(--swift-teal)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              </div>
              <a
                href="https://hiremebuddy.swiftdesignz.co.za"
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex items-center gap-3 self-start rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(48,176,176,0.18)" }}
              >
                <Image src="/images/hiremebuddy/logo.png" alt="" width={28} height={28} className="rounded-lg" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-[2px] text-[#d97706]">{t("footer.productLabel")}</span>
                  <span className="text-sm text-white">
                    HireMeBuddy™ <span className="text-gray-400">· {t("footer.productDesc")}</span>
                  </span>
                </span>
                <ArrowUpRight size={14} className="text-gray-500" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold uppercase tracking-[2px] text-[var(--swift-teal)] mb-5">
                {t(sectionTitleKeys[section.title] ?? section.title)}
              </p>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {t(linkKeys[link.href] ?? link.label)}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[rgba(48,176,176,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#b45309" }}>
            &copy; {new Date().getFullYear()} Swift Designz. {t("footer.rights")}
          </p>
          <p className="text-xs" style={{ color: "#b45309" }}>
            {t("footer.crafted")}
          </p>
        </div>
      </div>
    </footer>
  );
}
