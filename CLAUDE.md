# Swift Designz Website - Project Tracker

## Project Overview
- **Business:** Swift Designz - Software development, web design, e-commerce, apps, PM training, AI training
- **Legal Name:** SWIFT DESIGNZ INVESTMENTS CC
- **Owner:** Keenan Husselmann
- **Domain:** swiftdesignz.co.za (hosted by IT-Guru, South Africa)
- **Emails:** info@swiftdesignz.co.za, keenan@swiftdesignz.co.za
- **Phone:** NAM +264 81 388 1111 | SA +27 76 255 7783
- **Deployment:** Vercel (auto-deploy from GitHub: keenanswift101/swiftdesignzwebsite)

## Legal & Registration
- **Registered Name:** SWIFT DESIGNZ INVESTMENTS CC
- **Registration Number:** CC/2026/05589
- **Business Type:** Close Corporation (CC) - Namibia
- **Principal Business:** Software Development and Consultancy
- **Taxpayer ID (NamRA):** 16271273
- **Tax Type:** ITX 16271273-011
- **Registered Office:** ERF 55, Kenneth McArthur Street, Auas Blick, Windhoek, Namibia
- **Postal Address:** P.O. Box 4655, Rehoboth, Namibia
- **Financial Year End:** Last day of February each year
- **Registration Effective:** 12 May 2026
- **Tax Certificate Issued:** 29 May 2026 (Namibia Revenue Agency)

## Tech Stack
- **Framework:** Next.js 16.2.4 (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom glassmorphism/neon CSS
- **Animations:** Framer Motion
- **Email:** Resend API
- **i18n:** next-intl (English + Afrikaans)
- **Icons:** Lucide React

## Brand Identity
- **Colors:** #30B0B0 (teal), #303030 (dark gray), #509090 (muted teal), #307070 (deep teal), #101010 (near black)
- **Style:** Glassmorphism, neon accents, metallic elements, animated, clean, professional
- **NO:** Emojis, boilerplate templates, faith references
- **YES:** Interactive, fun, creative, elegant

## Social & Marketing
- **Facebook Page:** https://www.facebook.com/profile.php?id=61589116923728
- **Instagram:** https://www.instagram.com/swiftdesignz101
- **Meta Pixel ID:** 1731133011582846 (in src/app/layout.tsx)
- **Active Ads:** Lead Gen campaign (R50/day) + Boosted Reel (R50/day) = R100/day total
- **Ad Account Spending Limit:** R400/month cap
- **Google Sheets:** "Swift Designz - Leads" — auto lead delivery from Meta forms

## Pages
- [x] Home - Hero, 6 services overview, highlights, testimonials, CTA
- [x] About - Story, qualifications, 2yr web exp, 1yr app exp, Software Dev degree
- [x] Services - Web dev, E-commerce, Apps/Software, PM Training, AI Training, Support & Maintenance
- [x] Packages - 3 tiers per service (Websites from R2500, Stores from R4000, Apps from R5000)
- [x] Portfolio - 10 real projects with live links + testimonials section
- [x] Testimonials - Multiple testimonials section
- [x] Contact - Form with Resend integration + phone numbers sidebar card
- [x] Quote - Multi-step quote request form with Resend + proposed project plan in email
- [x] Links - Standalone page (no nav/footer) for social/link-in-bio
- [x] Privacy Policy
- [x] Terms & Conditions
- [x] Cookie Policy

## Portfolio Projects (9 total)
### Websites
- TB Free Foundation Website (custom design, responsive, SEO)
- DUNMORE Training & Skills Development → https://dunmore.co.za
- IA Academy - Neurodivergent School → https://ia-academy.org
- IT-Guru → https://it-guru.co.za
- Rehoboth Community Trust → https://rehotrust.org

### E-Commerce
- Ruby's Faith Jewellery Store (custom design, product catalogue)
- Fryse - Freeze Dried Products (fashion, filter system)

### Apps
- BasketBuddy - Budgeting App (mobile, native, cloud)
- HireMeBuddy™ - Local Services App (our own product) → https://hiremebuddy.swiftdesignz.co.za

## Special Features
- Drag-to-unlock splash screen (first visit / once per session)
  - Skipped for Facebook/Instagram in-app browsers (UA detection)
  - Skipped for ad/social traffic (fbclid, utm_source, utm_medium, gclid params)
  - localStorage + cookie dual check to prevent repeat shows
- Fun interactive elements: FunButton (smiley face, jokes/facts/mascot popup with CTA link)
- Bouncing "?" TetrisButton: navigates through key pages on odd clicks, shows "hire us" modal on even clicks
- ClickTracker component (global interaction tracking)
- Mascot character "Swifty" (Swift Designz logo-based)
- Cookie consent banner
- "Get a Quote" CTA button in Navbar (desktop + mobile)
- Bilingual: EN + AF
- Facebook + Instagram social icons in footer
- Phone numbers (NAM + SA) in footer and contact page sidebar

## Package Pricing
### Websites
- Starter: From R2,500 (up to 3 pages, basic design)
- Professional: From R5,000 (up to 7 pages, custom design)
- Premium: From R10,000 (10+ pages, full custom + animations)

### E-Commerce Stores
- Starter: From R4,000 (up to 20 products, catalogue only)
- Business: From R7,500 (up to 100 products, advanced features)
- Enterprise: From R15,000 (unlimited products, full custom)

### Apps & Software
- MVP: From R5,000 (core features, 1 platform)
- Standard: From R12,000 (full features, 2 platforms)
- Full-Scale: From R25,000+ (enterprise-grade, cross-platform)

## Scripts & Tools
- `scripts/screenshot-portfolio.mjs` — Puppeteer script to auto-screenshot live portfolio sites into `public/potfolio/`
- `scripts/generate-signature-keenan.mjs` — Generates email signature PNG (`public/images/signature-keenan.png`)
- `scripts/export-fb-carousel.mjs` — Exports FB carousel HTML slides as PNGs into `public/marketing/` (requires dev server)
- `scripts/record-posts.js` — Playwright video recorder for social media HTML posts (frame-perfect, pipes to ffmpeg)

## Assets
- `public/images/` — App images (logo, favicon, headshot, signatures) used by Next.js
- `public/potfolio/` — Portfolio project thumbnails (referenced in portfolio page)
- `public/marketing/` — All social/marketing images + videos (FB, IG, WhatsApp, video posts) — not served by app
- `public/images/signature-keenan.png` — Email signature image asset

## Admin Site
- Business documents (NDA, invoices, onboarding, quotes, etc.) are hosted at the admin site: `C:\Users\keena\Projects\swift-designz-admin`
- Do not add doc templates or HTML documents to this repo

## Build Progress
- Phase 1: Project setup, configs, design system ✅
- Phase 2: Layout, navigation, splash screen ✅
- Phase 3: All pages ✅
- Phase 4: Interactive elements, i18n, polish ✅
- Phase 5: Marketing infrastructure ✅
  - Meta Pixel deployed
  - Lead Gen campaign live
  - Boosted reel live
  - Google Sheets lead delivery
  - Social links in footer
  - Phone numbers sitewide
  - Splash screen fixed for FB/ad traffic
- Phase 6: Portfolio expansion + UX polish ✅
  - 5 new real-world portfolio projects added (DUNMORE, Essential 420, IA Academy, IT-Guru, RHB Trust)
  - Ruby's Faith thumbnail replaced (JPG → PNG)
  - Removed placeholder thumbnails (highly-medicated, swift_designs_logo)
  - Puppeteer screenshot script for auto-generating thumbnails
  - Support & Maintenance added as 6th service on home page
  - Get a Quote button added to Navbar (desktop + mobile)
  - TetrisButton (bouncing "?") added to global shell
  - ClickTracker added to global shell
  - Email signature PNG created for keenan@
- Phase 7: Project cleanup ✅
  - Removed public/docs/ (moved to admin site)
  - Removed ~31 marketing HTML files from public root
  - Consolidated all marketing images + videos into public/marketing/
  - Removed 38 one-off scripts; scripts/ now contains only 2 active tools
- Phase 8: Business registration + infrastructure migration ✅
  - Official registration: SWIFT DESIGNZ INVESTMENTS CC (CC/2026/05589, TIN 16271273). The NamRA tax certificate prints cc/2026/055589 (NamRA typo); the BIPA founding statement (CK1) is authoritative: CC/2026/05589.
  - Legal pages updated with registered name, reg number, governing law corrected to Namibia
  - "Freelance" references replaced with "registered company" in copy and SEO metadata
  - GitHub repo transferred from KeenanHusselmann to keenanswift101
  - Migrated from Netlify to Vercel: netlify.toml removed, @netlify/plugin-nextjs uninstalled
  - Cache headers moved from netlify.toml into next.config.ts
  - swiftdesignz.co.za DNS updated to Vercel at IT-Guru
  - All env vars migrated to Vercel dashboard
  - Production build clean: 18 pages, TypeScript passes, zero errors

