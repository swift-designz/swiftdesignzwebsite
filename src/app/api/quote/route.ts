import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import {
  escapeHtml,
  SERVICE_LABELS,
  buildPlan,
  EMAIL_REGEX,
  getPackageLabel,
  VALID_SERVICES,
} from "@/lib/quoteUtils";

// ── Input sanitisation helpers ───────────────────────────────────────────────
/** Coerce to string and hard-cap length. Returns "" for non-strings. */
const str = (v: unknown, max: number): string =>
  typeof v === "string" ? v.slice(0, max) : "";

/** Coerce to a string array with item count and per-item length caps. */
const strArr = (v: unknown, maxItems: number, maxItemLen: number): string[] =>
  (Array.isArray(v) ? v : [])
    .slice(0, maxItems)
    .map((i) => str(i, maxItemLen))
    .filter(Boolean);


function row(label: string, value: string, color = "#e0e0e0") {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;width:150px;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:${color};font-size:13px;">${escapeHtml(value)}</td>
  </tr>`;
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const raw = body as Record<string, unknown>;

    // ── Sanitised fields: enforce length limits before any processing ────────
    const name            = str(raw.name, 100);
    const email           = str(raw.email, 254);
    const phone           = str(raw.phone, 30);
    const company         = str(raw.company, 100);
    const location        = str(raw.location, 100);
    const service         = str(raw.service, 50);
    const pkg             = str(raw.package, 50);
    const scope           = str(raw.scope, 5000);
    const timeline        = str(raw.timeline, 100);
    const contentReady    = str(raw.contentReady, 100);
    const referenceUrls   = str(raw.referenceUrls, 500);
    const attendees       = str(raw.attendees, 50);
    const experienceLevel = str(raw.experienceLevel, 100);
    const budget          = str(raw.budget, 100);
    const notes           = str(raw.notes, 2000);
    const source          = str(raw.source, 100);

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name || !email) {
      return NextResponse.json({ error: "Your name and email are the bare minimum — we promise we won't spam you." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "That email doesn't look quite right. Is it hiding something? (A typo, we mean.)" }, { status: 400 });
    }

    // ── Service allowlist ─────────────────────────────────────────────────────
    if (service && !VALID_SERVICES.includes(service)) {
      return NextResponse.json({ error: "That service isn't something we offer. Please select a valid option." }, { status: 400 });
    }
    const serviceLabel = SERVICE_LABELS[service] ?? "General Enquiry";

    // ── Arrays: cap item count and per-item length ────────────────────────────
    const featureArr     = strArr(raw.features, 20, 80);
    const lookFeelArr    = strArr(raw.lookFeel, 10, 50);
    const themesArr      = strArr(raw.themes, 10, 50);
    const keywordsArr    = strArr(raw.keywords, 20, 50);
    const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    const brandColorsArr = strArr(raw.brandColors, 8, 10).filter((c) => HEX_COLOR_RE.test(c));

    const makeTagList = (arr: string[]) => arr.length > 0
      ? arr.map((t) => `<span style="display:inline-block;margin:2px 3px;padding:3px 10px;border-radius:20px;font-size:11px;background:rgba(48,176,176,0.12);border:1px solid rgba(48,176,176,0.25);color:#30B0B0;">${escapeHtml(t)}</span>`).join("")
      : `<span style="color:#555;font-size:12px;">None selected</span>`;

    const featureList = featureArr.length > 0
      ? `<ul style="margin:8px 0 0;padding:0;list-style:none;">${featureArr.map((f) => `<li style="padding:3px 0;color:#30B0B0;font-size:13px;">&#10003;&nbsp;&nbsp;${escapeHtml(f)}</li>`).join("")}</ul>`
      : `<span style="color:#555;font-size:12px;">None selected</span>`;

    

    const proposedPlan = buildPlan(service, pkg);

    function buildPlanHtml(): string {
      if (proposedPlan.length === 0) return "";
      const rows = proposedPlan.map((ph, i) => `
        <tr>
          <td style="padding:14px 12px;border-bottom:1px solid rgba(48,176,176,0.08);vertical-align:middle;width:36px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="width:26px;height:26px;border-radius:13px;background:rgba(48,176,176,0.12);border:1px solid rgba(48,176,176,0.35);color:#30B0B0;font-size:11px;font-weight:700;text-align:center;vertical-align:middle;line-height:26px;">${i + 1}</td></tr></table>
          </td>
          <td style="padding:14px 12px;border-bottom:1px solid rgba(48,176,176,0.08);vertical-align:top;">
            <div style="color:#fff;font-weight:600;font-size:13px;margin-bottom:3px;">${escapeHtml(ph.title)}</div>
            <div style="color:#999;font-size:12px;line-height:1.6;">${escapeHtml(ph.desc)}</div>
          </td>
          <td style="padding:14px 12px;border-bottom:1px solid rgba(48,176,176,0.08);vertical-align:top;white-space:nowrap;">
            <div style="color:#30B0B0;font-size:11px;font-weight:600;">${escapeHtml(ph.duration)}</div>
            <div style="color:#555;font-size:10px;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px;">duration</div>
          </td>
          <td style="padding:14px 12px;border-bottom:1px solid rgba(48,176,176,0.08);vertical-align:top;">
            <div style="color:#ccc;font-size:11px;line-height:1.5;">${escapeHtml(ph.deliverable)}</div>
            <div style="color:#555;font-size:10px;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px;">deliverable</div>
          </td>
        </tr>
      `).join("");
      return `
        <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Proposed Project Plan</h3>
        <p style="color:#888;font-size:12px;line-height:1.6;margin:0 0 16px;">
          Based on your selection, here is a suggested project roadmap. Timelines are estimates and will be refined during our initial consultation.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;background:rgba(48,176,176,0.03);border-radius:8px;overflow:hidden;border:1px solid rgba(48,176,176,0.1);">
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-bottom:28px;padding:12px 16px;background:rgba(255,200,0,0.05);border:1px solid rgba(255,200,0,0.15);border-radius:6px;border-left:3px solid rgba(255,200,0,0.4);">
          <p style="margin:0;color:#b0900a;font-size:11px;line-height:1.65;">
            <strong style="color:#d4aa20;">&#9432; Pricing Note:</strong>&nbsp;
            All prices shown are starting rates only. The final cost will be determined based on your specific requirements, complexity, and any additional features or customisations requested. A detailed, itemised quote will be provided after your initial consultation.
          </p>
        </div>
      `;
    }

    // Dedicated quote notification addresses — supports comma-separated list; falls back to contact address, then info@
    const notifyTo = (process.env.QUOTE_NOTIFY_EMAIL ?? process.env.CONTACT_NOTIFY_EMAIL ?? "info@swiftdesignz.co.za")
      .split(",").map((e) => e.trim()).filter(Boolean);

    const notifyHtml = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:660px;margin:0 auto;background:#101010;color:#e0e0e0;padding:40px;border-radius:16px;border:1px solid rgba(48,176,176,0.2);">
          <div style="text-align:center;margin-bottom:32px;">
            <img src="https://swiftdesignz.co.za/images/logo.png" alt="Swift Designz" style="height:55px;width:auto;display:block;margin:0 auto 16px;" />
            <h1 style="color:#30B0B0;font-size:22px;margin:0;">New Quote Request</h1>
            <div style="width:60px;height:2px;background:linear-gradient(90deg,#30B0B0,transparent);margin:12px auto 0;"></div>
          </div>

          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Client Details</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
            ${row("Name", name, "#fff")}
            ${row("Email", email, "#30B0B0")}
            ${row("Phone", phone ?? "")}
            ${row("Company", company ?? "")}
            ${row("Location", location ?? "")}
          </table>

          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Service Request</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
            ${row("Service", serviceLabel, "#fff")}
            ${row("Package", pkg ?? "", "#30B0B0")}
            ${row("Budget", budget ?? "")}
            ${row("Timeline", timeline ?? "")}
            ${row("Content Ready", contentReady ?? "")}
            ${row("Reference URLs", referenceUrls ?? "")}
            ${row("Attendees", attendees ?? "")}
            ${row("Experience Level", experienceLevel ?? "")}
          </table>

          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Features Requested</h3>
          <div style="margin-bottom:28px;padding:14px 18px;background:rgba(48,176,176,0.05);border-radius:8px;border:1px solid rgba(48,176,176,0.1);">
            ${featureList}
          </div>

          ${lookFeelArr.length > 0 ? `
          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Look &amp; Feel</h3>
          <div style="margin-bottom:28px;padding:14px 18px;background:rgba(48,176,176,0.05);border-radius:8px;border:1px solid rgba(48,176,176,0.1);">
            ${makeTagList(lookFeelArr)}
          </div>` : ""}

          ${themesArr.length > 0 ? `
          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Colour Theme</h3>
          <div style="margin-bottom:28px;padding:14px 18px;background:rgba(48,176,176,0.05);border-radius:8px;border:1px solid rgba(48,176,176,0.1);">
            ${makeTagList(themesArr)}
          </div>` : ""}

          ${brandColorsArr.length > 0 ? `
          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Brand Colours</h3>
          <div style="margin-bottom:28px;padding:14px 18px;background:rgba(48,176,176,0.05);border-radius:8px;border:1px solid rgba(48,176,176,0.1);display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
            ${brandColorsArr.length >= 2 ? `<div style="width:56px;height:22px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:linear-gradient(to right,${escapeHtml(brandColorsArr[0])} 50%,${escapeHtml(brandColorsArr[1])} 50%);flex-shrink:0;"></div>` : ""}
            ${brandColorsArr.map((c) => `<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 6px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);font-size:11px;color:#ccc;font-family:monospace;"><span style="width:14px;height:14px;border-radius:50%;background:${escapeHtml(c)};display:inline-block;border:1px solid rgba(255,255,255,0.15);flex-shrink:0;"></span>${escapeHtml(c)}</span>`).join("")}
          </div>` : ""}

          ${keywordsArr.length > 0 ? `
          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Brand / Vibe Keywords</h3>
          <div style="margin-bottom:28px;padding:14px 18px;background:rgba(48,176,176,0.05);border-radius:8px;border:1px solid rgba(48,176,176,0.1);">
            ${makeTagList(keywordsArr)}
          </div>` : ""}

          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Project Description</h3>
          <div style="margin-bottom:28px;padding:16px 18px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
            <p style="color:#ccc;line-height:1.7;margin:0;white-space:pre-wrap;font-size:14px;">${escapeHtml(scope ?? "")}</p>
          </div>

          ${notes ? `
          <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Additional Notes</h3>
          <div style="margin-bottom:28px;padding:16px 18px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
            <p style="color:#ccc;line-height:1.7;margin:0;white-space:pre-wrap;font-size:14px;">${escapeHtml(notes)}</p>
          </div>` : ""}

          ${source ? `<p style="color:#555;font-size:12px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);padding-top:20px;margin:8px 0 0;">Found via: ${escapeHtml(source)}</p>` : ""}
        </div>
      `;

    // Send to all configured notification addresses
    const { error: notifyError } = await resend.emails.send({
      from: "Swift Designz Quote System <noreply@swiftdesignz.co.za>",
      to: notifyTo,
      replyTo: email,
      subject: `New Quote Request — ${serviceLabel} — ${escapeHtml(name)}`,
      html: notifyHtml,
    });
    if (notifyError) {
      console.error("Quote notify send error:", notifyError);
      throw new Error(notifyError.message ?? "Failed to send notification email");
    }

    // Lead capture, deferred with after() rather than left as a floating promise.
    //
    // This was `fetch(...).catch(() => {})`. On Vercel the function returns its response
    // and the runtime suspends, often before an unawaited fetch has finished, so the lead
    // was delivered or dropped depending on timing. The integration shipped on 17 June
    // 2026 and produced no leads at all in the three and a half months that followed:
    // people filled the form in, got a confirmation email saying it had been received,
    // and it never arrived.
    //
    // after() keeps the invocation alive until the work completes, and a failure is now
    // logged instead of swallowed.
    after(async () => {
      try {
        const res = await fetch("https://admin.swiftdesignz.co.za/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source:       "quote_form",
            name,
            email,
            phone:        phone    || null,
            company:      company  || null,
            location:     location || null,
            service:      serviceLabel || null,
            package:      pkg      || null,
            scope:        scope    || null,
            timeline:     timeline || null,
            budget:       budget   || null,
            message:      notes    || null,
            brand_colors: brandColorsArr.length > 0 ? brandColorsArr : null,
          }),
        });
        if (!res.ok) console.error("quote_form lead capture rejected:", res.status, await res.text());
      } catch (err) {
        console.error("quote_form lead capture failed:", err);
      }
    });

    // Confirmation to client
    const pkgLabel = getPackageLabel(service, pkg);
    const { error: confirmError } = await resend.emails.send({
      from: "Swift Designz <noreply@swiftdesignz.co.za>",
      to: [email],
      subject: `Your Quote Request — ${serviceLabel} — Swift Designz`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:660px;margin:0 auto;background:#101010;color:#e0e0e0;border-radius:16px;overflow:hidden;border:1px solid rgba(48,176,176,0.2);">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#0d1f1f 0%,#101010 100%);padding:40px 40px 28px;text-align:center;border-bottom:1px solid rgba(48,176,176,0.15);">
            <img src="https://swiftdesignz.co.za/images/logo.png" alt="Swift Designz" style="height:55px;width:auto;display:block;margin:0 auto 16px;" />
            <h1 style="color:#fff;font-size:22px;margin:0 0 6px;">Thanks, ${escapeHtml(name)}!</h1>
            <p style="color:#30B0B0;font-size:13px;margin:0;letter-spacing:1px;text-transform:uppercase;">Quote Request Received</p>
            <div style="width:50px;height:2px;background:linear-gradient(90deg,transparent,#30B0B0,transparent);margin:14px auto 0;"></div>
          </div>

          <div style="padding:36px 40px;">

            <!-- Intro -->
            <p style="color:#ccc;line-height:1.75;font-size:14px;margin:0 0 28px;">
              We've received your quote request for <strong style="color:#30B0B0;">${escapeHtml(serviceLabel)}</strong> — <strong style="color:#fff;">${escapeHtml(pkgLabel)}</strong>.
              Our team will review your brief and get back to you with a tailored proposal within <strong style="color:#fff;">24 hours</strong>.
            </p>

            <!-- Submission Summary -->
            <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Submission Summary</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;background:rgba(255,255,255,0.02);border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
              <tbody>
                ${row("Service", serviceLabel, "#30B0B0")}
                ${row("Package", pkgLabel, "#fff")}
                ${budget ? row("Budget", budget) : ""}
                ${timeline ? row("Timeline", timeline) : ""}
                ${contentReady ? row("Content Ready", contentReady) : ""}
                ${featureArr.length > 0 ? `<tr>
                  <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;width:150px;vertical-align:top;">Features</td>
                  <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;line-height:1.7;">
                    ${featureArr.map(f => `<span style="display:inline-block;margin:2px 3px;padding:2px 9px;border-radius:20px;font-size:11px;background:rgba(48,176,176,0.1);border:1px solid rgba(48,176,176,0.2);color:#30B0B0;">${escapeHtml(f)}</span>`).join("")}
                  </td>
                </tr>` : ""}
                ${referenceUrls ? row("Reference URLs", referenceUrls, "#888") : ""}
              </tbody>
            </table>

            ${(lookFeelArr.length > 0 || themesArr.length > 0 || keywordsArr.length > 0 || brandColorsArr.length > 0) ? `
            <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Design Preferences</h3>
            <div style="margin-bottom:28px;padding:16px 18px;background:rgba(48,176,176,0.04);border-radius:8px;border:1px solid rgba(48,176,176,0.1);">
              ${lookFeelArr.length > 0 ? `<div style="margin-bottom:8px;"><span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-right:8px;">Look &amp; Feel:</span>${makeTagList(lookFeelArr)}</div>` : ""}
              ${themesArr.length > 0 ? `<div style="margin-bottom:8px;"><span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-right:8px;">Colours:</span>${makeTagList(themesArr)}</div>` : ""}
              ${keywordsArr.length > 0 ? `<div style="margin-bottom:8px;"><span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-right:8px;">Brand Vibe:</span>${makeTagList(keywordsArr)}</div>` : ""}
              ${brandColorsArr.length > 0 ? `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
                <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-right:4px;">Brand Colours:</span>
                ${brandColorsArr.length >= 2 ? `<span style="display:inline-block;width:52px;height:20px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:linear-gradient(to right,${escapeHtml(brandColorsArr[0])} 50%,${escapeHtml(brandColorsArr[1])} 50%);vertical-align:middle;"></span>` : ""}
                ${brandColorsArr.map((c) => `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px 3px 5px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);font-size:11px;color:#ccc;font-family:monospace;"><span style="width:12px;height:12px;border-radius:50%;background:${escapeHtml(c)};display:inline-block;border:1px solid rgba(255,255,255,0.15);flex-shrink:0;"></span>${escapeHtml(c)}</span>`).join("")}
              </div>` : ""}
            </div>` : ""}

            <!-- Project Description -->
            <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Project Brief</h3>
            <div style="margin-bottom:28px;padding:16px 18px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:3px solid #30B0B0;border-top:1px solid rgba(48,176,176,0.1);border-right:1px solid rgba(48,176,176,0.1);border-bottom:1px solid rgba(48,176,176,0.1);">
              <p style="color:#ccc;line-height:1.75;margin:0;white-space:pre-wrap;font-size:13px;">${escapeHtml(scope ?? "")}</p>
            </div>

            ${notes ? `
            <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Additional Notes</h3>
            <div style="margin-bottom:28px;padding:14px 18px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
              <p style="color:#aaa;line-height:1.75;margin:0;white-space:pre-wrap;font-size:13px;">${escapeHtml(notes)}</p>
            </div>` : ""}

            <!-- Proposed Plan -->
            ${buildPlanHtml()}

            <!-- What Happens Next -->
            <h3 style="color:#30B0B0;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">What Happens Next</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <tbody>
                <tr>
                  <td style="padding:10px 14px;vertical-align:top;width:30px;color:#30B0B0;font-size:18px;font-weight:700;">1</td>
                  <td style="padding:10px 14px;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="color:#fff;font-weight:600;font-size:13px;">We review your brief</div>
                    <div style="color:#888;font-size:12px;margin-top:3px;">Keenan personally reviews your request and scope within a few hours.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;vertical-align:top;width:30px;color:#30B0B0;font-size:18px;font-weight:700;">2</td>
                  <td style="padding:10px 14px;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="color:#fff;font-weight:600;font-size:13px;">You receive a tailored proposal</div>
                    <div style="color:#888;font-size:12px;margin-top:3px;">A detailed quote with scope, timeline, and pricing — within 24 hours.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;vertical-align:top;width:30px;color:#30B0B0;font-size:18px;font-weight:700;">3</td>
                  <td style="padding:10px 14px;vertical-align:top;">
                    <div style="color:#fff;font-weight:600;font-size:13px;">We kick off</div>
                    <div style="color:#888;font-size:12px;margin-top:3px;">Once approved, we schedule a discovery call and get started.</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- CTA -->
            <div style="text-align:center;margin-bottom:32px;">
              <a href="https://swiftdesignz.co.za/portfolio" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#30B0B0,#307070);color:#fff;font-weight:700;font-size:13px;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">View Our Portfolio</a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background:rgba(0,0,0,0.3);padding:20px 40px;text-align:center;border-top:1px solid rgba(48,176,176,0.1);">
            <p style="color:#555;font-size:12px;margin:0 0 4px;"><strong style="color:#30B0B0;">Swift Designz</strong> — Crafting Digital Excellence</p>
            <p style="color:#444;font-size:11px;margin:0;">
              <a href="https://swiftdesignz.co.za" style="color:#507070;text-decoration:none;">swiftdesignz.co.za</a>
              &nbsp;&middot;&nbsp;
              <a href="mailto:info@swiftdesignz.co.za" style="color:#507070;text-decoration:none;">info@swiftdesignz.co.za</a>
            </p>
          </div>
        </div>
      `,
    });
    if (confirmError) {
      console.error("Quote client confirmation error:", JSON.stringify(confirmError));
      return NextResponse.json({ success: true, confirmationSent: false });
    }

    return NextResponse.json({ success: true, confirmationSent: true });
  } catch (error) {
    console.error("Quote form error:", error);
    return NextResponse.json(
      { error: "Our quote robot tripped over a cable. Give it another shot — it should be fine now!" },
      { status: 500 }
    );
  }
}
