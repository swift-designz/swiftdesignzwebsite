"use client";

import { motion, useInView } from "framer-motion";
import { ExternalLink, ArrowRight, Code2, ShoppingBag, Smartphone, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import TestimonialCard from "@/app/components/sections/TestimonialCard";
import { useI18n } from "@/i18n/I18nProvider";

type ProjectCategory = "all" | "websites" | "ecommerce" | "apps";

interface Project {
  title: string;
  category: "websites" | "ecommerce" | "apps";
  description: string;
  image: string;
  imageFit?: "cover" | "contain";
  tags: string[];
  link?: string;
}

const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEklEQVR42mMQkJD4jw8zjAwFAMjAT8EeYpgGAAAAAElFTkSuQmCC";

// Template projects - replace with actual projects
const projects: Project[] = [
  // --- Websites ---
  {
    title: "TB Free Foundation Website",
    category: "websites",
    description:
      "A stunning, clean-flowing website with an inviting user experience. Custom design with carefully chosen typography and a calm, professional aesthetic.",
    image: "/potfolio/tbfree-portfolio-thumbnail.png",
    link: "https://tb-free.org",
    tags: ["Custom Design", "Responsive", "SEO"],
  },
  {
    title: "DUNMORE Training & Skills Development",
    category: "websites",
    description:
      "A professional website for a SETA-accredited training provider offering accredited programmes in First Aid, Fire Fighting, Health & Safety, and Forestry across the Western Cape.",
    image: "/potfolio/dunmoretraining-portfolio-thumbnail.png",
    link: "https://dunmore.co.za",
    tags: ["Custom Design", "Responsive", "Training"],
  },
  {
    title: "IA Academy - Neurodivergent School",
    category: "websites",
    description:
      "A warm, welcoming website for a neurodivergent-friendly Cambridge school in Windhoek, Namibia. Specialising in ADHD, ADD, and Dyslexia support from Grade R to Grade 12.",
    image: "/potfolio/iaacademy-portfolio-thumbnail.png",
    link: "https://ia-academy.org",
    tags: ["Custom Design", "Education", "Responsive"],
  },
  {
    title: "IT-Guru Online",
    category: "websites",
    description:
      "A clean, professional website for a Cape Town IT support business offering web hosting, domain registration, remote support, and network solutions.",
    image: "/potfolio/it-guru-portfolio-thumbnail.png",
    link: "https://it-guru.co.za",
    tags: ["Custom Design", "IT Services", "Responsive"],
  },
  {
    title: "Rehoboth Community Trust",
    category: "websites",
    description:
      "A purpose-driven website for a Namibian non-profit focused on sustainable community development, empowering the people of Rehoboth through impactful programmes since 2003.",
    image: "/potfolio/rhb-community-trust-portfolio-thumbnail.png",
    link: "https://rehotrust.org",
    tags: ["Non-Profit", "Custom Design", "Responsive"],
  },
  // --- E-Commerce ---
  {
    title: "Ruby's Faith Jewellery Store",
    category: "ecommerce",
    description:
      "An elegant online store for a jewellery brand, featuring a visually rich product catalogue, seamless shopping experience, and a design that reflects the brand's unique style.",
    image: "/potfolio/rubys-faith-portfolio-thumbnail.png",
    link: "https://rubysfaith.co.za",
    tags: ["E-Commerce", "Product Catalogue", "Custom Design"],
  },
  {
    title: "Fryse - Freeze Dried Products",
    category: "ecommerce",
    description:
      "An elegant online store for a freeze-dried food company, showcasing their range of products with rich visuals, easy navigation, and a seamless shopping experience.",
    image: "/potfolio/fryse-portfolio-thumbnail.png",
    link: "https://fryse.com.na",
    tags: ["Fashion", "E-Commerce", "Filter System"],
  },
  // --- Apps ---
  {
    title: "BasketBuddy - Budgeting App",
    category: "apps",
    description:
      "A sleek, user-friendly budgeting app that helps users track expenses, set financial goals, and visualize spending habits with elegant charts and a calming interface.",
    image: "/potfolio/basket-buddy-portfolio-thumbnail1.png",
    tags: ["Mobile App", "Native", "Cloud"],
  },
  {
    title: "HireMeBuddy™ - Local Services App",
    category: "apps",
    description:
      "Our own product: a Namibian app that connects people with ID-checked local providers for 129 services, from plumbers and braiders to bookkeepers and DStv installers. Client, provider and admin apps with bookings, chat and safety sharing. Launching in Windhoek.",
    image: "/potfolio/hiremebuddy-portfolio-thumbnail.png",
    tags: ["Our Product", "Mobile App", "Marketplace"],
    link: "https://hiremebuddy.swiftdesignz.co.za",
  },
];

const testimonials = [
  {
    quote:
      "Yoh! the website is looking fire 🔥 😍 yoh yoh yoh ! Thats mad and so convenient 👌🏼😍 wow",
    name: "Anonymous",
    role: "Client",
  },
  {
    quote:
      "I can only thank God for putting this young man on our path. He immediately understood the assignment. A huge thank you to Keenan and Ambrose for executing everything in excellence. We are so grateful. Thank you, Keenan.",
    name: "Grateful Client",
    role: "Client",
  },
  {
    quote:
      "The banner, overall look and feel, font and clean flowing state of the site is STUNNING. User Experience pleasant, calm and inviting. I love it.",
    name: "Satisfied Client",
    role: "Business Owner",
  },
  {
    quote:
      "From my experience working with many developers across various projects, you should be proud of yourself. You take ownership, and your work ethic truly stands out, something I cannot say about many developers I have worked with. Your work clearly reflects your passion, dedication, and skill.",
    name: "Industry Professional",
    role: "Project Manager - Ambrose Isaacs",
  },
  {
    quote:
      "This is soooo beautiful. I am speechless. The colours, the feel — you got it all. I love this now... it speaks of hope, new mercies in the morning. You are truly blessed with a great gift.",
    name: "Ruth Gwasira",
    role: "Client — Ruby's Faith Jewellery",
  },  {
    quote:
      "Ek kan nie glo dis my shop nie. Alles is baie smart. Dis 'n great 'shoppers' website! Baie dankie vir die goeie navorsing wat jy gedoen het by die beskrywings. Ek is oorweldig!",
    name: "Yvonne Steenkamp",
    role: "Client \u2014 Fryse",
  },];

const filterTabs = [
  { id: "all" as ProjectCategory, label: "All Projects" },
  { id: "websites" as ProjectCategory, label: "Websites", icon: Code2 },
  { id: "ecommerce" as ProjectCategory, label: "E-Commerce", icon: ShoppingBag },
  { id: "apps" as ProjectCategory, label: "Apps", icon: Smartphone },
];

export default function PortfolioPage() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const router = useRouter();
  const testimonialSectionRef = useRef<HTMLDivElement>(null);
  const testimonialSectionInView = useInView(testimonialSectionRef, { once: true });
  const [activeTIdx, setActiveTIdx] = useState(-1);

  useEffect(() => {
    if (testimonialSectionInView && activeTIdx === -1) startTransition(() => setActiveTIdx(0));
  }, [testimonialSectionInView, activeTIdx]);

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="section pt-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("portfolioPage.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              {t("portfolioPage.title")} <span className="text-gradient">{t("portfolioPage.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t("portfolioPage.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-4">
        <div className="container">
          <div className="flex justify-center">
            <div
              className="inline-flex gap-2 p-1.5 rounded-xl flex-wrap justify-center"
              style={{
                background: "rgba(16, 16, 16, 0.8)",
                border: "1px solid rgba(48, 176, 176, 0.12)",
                boxShadow: "0 0 0 1px rgba(217,119,6,0.06) inset",
              }}
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === tab.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  style={
                    activeFilter === tab.id
                      ? {
                          background: "rgba(48,176,176,0.12)",
                          boxShadow: "0 0 12px rgba(48,176,176,0.1), inset 0 0 1px rgba(217,119,6,0.25)",
                          borderBottom: "1.5px solid rgba(217,119,6,0.45)",
                        }
                      : undefined
                  }
                >
                  {tab.id === "all" ? t("portfolioPage.filterAll") : tab.id === "websites" ? t("portfolioPage.filterWebsites") : tab.id === "ecommerce" ? t("portfolioPage.filterEcommerce") : t("portfolioPage.filterApps")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section pt-8">
        <div className="container">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass glass-hover overflow-hidden group cursor-pointer"
                onClick={() => {
                  if (!project.link) router.push("/contact");
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 md:h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    className={`transition-transform duration-700 ${
                      project.imageFit === "contain"
                        ? "object-contain p-6 bg-[rgba(16,16,16,0.55)] group-hover:scale-105"
                        : "object-cover group-hover:scale-110"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--swift-black)] via-transparent to-transparent opacity-60" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[var(--swift-black)]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-btn text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("portfolioPage.viewProject")} <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="neon-btn text-sm pointer-events-none">
                        <MessageSquare size={14} /> {t("portfolioPage.enquireAbout")}
                      </span>
                    )}
                  </div>

                  {/* Category badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                    style={{
                      background:
                        project.category === "ecommerce"
                          ? "#d97706"
                          : project.category === "apps"
                          ? "#b45309"
                          : "var(--swift-teal)",
                      color: "#0a0500",
                      boxShadow:
                        project.category === "ecommerce"
                          ? "0 0 10px rgba(217,119,6,0.45)"
                          : project.category === "apps"
                          ? "0 0 10px rgba(180,83,9,0.4)"
                          : "0 0 10px rgba(48,176,176,0.4)",
                    }}
                  >
                    {project.category === "ecommerce"
                      ? t("portfolioPage.catEcommerce")
                      : project.category === "apps"
                      ? t("portfolioPage.catApp")
                      : t("portfolioPage.catWebsite")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      ["ecommerce", "apps"].includes(project.category)
                        ? "group-hover:text-amber-600"
                        : "group-hover:text-[var(--swift-teal)]"
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-md"
                        style={
                          ti === 0
                            ? {
                                background: "rgba(180,83,9,0.07)",
                                color: "#b45309",
                                border: "1px solid rgba(180,83,9,0.14)",
                              }
                            : {
                                background: "rgba(48,176,176,0.06)",
                                color: "var(--swift-muted)",
                                border: "1px solid rgba(48,176,176,0.08)",
                              }
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" ref={testimonialSectionRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("portfolioPage.testimonialsEyebrow")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              {t("portfolioPage.testimonialsTitle")} <span className="text-gradient">{t("portfolioPage.testimonialsHighlight")}</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={i}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                delay={i * 0.1}
                isActive={activeTIdx === i}
                isPending={activeTIdx >= 0 && activeTIdx < i}
                onDone={() => setActiveTIdx(i + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong p-12 md:p-16 text-center rounded-3xl"
            style={{ boxShadow: "0 0 0 1px rgba(217,119,6,0.08) inset, 0 0 60px rgba(217,119,6,0.06)" }}
          >
            {/* Amber accent bar */}
            <div style={{ width: 56, height: 3, background: "linear-gradient(90deg, transparent, #d97706, #f59e0b, transparent)", margin: "0 auto 28px", borderRadius: 2 }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("portfolioPage.ctaTitle")} <span className="text-gradient">{t("portfolioPage.ctaHighlight")}</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              {t("portfolioPage.ctaDesc")}
            </p>
            <Link href="/contact" className="neon-btn-filled neon-btn">
              {t("portfolioPage.ctaBtn")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
