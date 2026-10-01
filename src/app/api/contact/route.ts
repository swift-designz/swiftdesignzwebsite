import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req);
  if (limited) return limited;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const raw = body as Record<string, unknown>;

    // ── Input length limits ────────────────────────────────────────────────────
    const s = (v: unknown, max: number): string =>
      typeof v === "string" ? v.slice(0, max) : "";
    const name    = s(raw.name, 100);
    const email   = s(raw.email, 254);
    const phone   = s(raw.phone, 30);
    const service = s(raw.service, 100);
    const budget  = s(raw.budget, 50);
    const message = s(raw.message, 5000);

    // Strip characters that could manipulate email From header (RFC 2822)
    const fromName = name.replace(/[\r\n"<>]/g, " ").trim().slice(0, 80);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "We need your name, email, and message — otherwise we'd just be staring at a blank form." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look quite right. Typo, perhaps?" },
        { status: 400 }
      );
    }

    // Send notification to Swift Designz (supports comma-separated list of addresses)
    const notifyEmails = (process.env.CONTACT_NOTIFY_EMAIL ?? "info@swiftdesignz.co.za")
      .split(",").map((e) => e.trim()).filter(Boolean);
    const { error: notifyError } = await resend.emails.send({
      from: `${fromName} via Swift Designz <noreply@swiftdesignz.co.za>`,
      to: notifyEmails,
      replyTo: email,
      subject: `New Project Enquiry from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #101010; color: #e0e0e0; padding: 40px; border-radius: 16px; border: 1px solid rgba(48, 176, 176, 0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://swiftdesignz.co.za/images/logo.png" alt="Swift Designz" style="height: 60px; width: auto; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #30B0B0; font-size: 24px; margin: 0;">New Project Enquiry</h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #30B0B0, transparent); margin: 12px auto;"></div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #30B0B0;">${escapeHtml(email)}</td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(phone)}</td>
            </tr>` : ""}
            ${service ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(service)}</td>
            </tr>` : ""}
            ${budget ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(budget)}</td>
            </tr>` : ""}
          </table>
          
          <div style="margin-top: 24px; padding: 20px; background: rgba(48, 176, 176, 0.05); border-radius: 8px; border: 1px solid rgba(48, 176, 176, 0.1);">
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Message</p>
            <p style="color: #e0e0e0; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          
          <p style="color: #555; font-size: 11px; text-align: center; margin-top: 30px;">
            This message was sent via the Swift Designz website contact form.
          </p>
        </div>
      `,
    });
    if (notifyError) {
      console.error("Contact notify send error:", notifyError);
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
            source:  "contact_form",
            name,
            email,
            phone:   phone   || null,
            service: service || null,
            budget:  budget  || null,
            message: message || null,
          }),
        });
        if (!res.ok) console.error("contact_form lead capture rejected:", res.status, await res.text());
      } catch (err) {
        console.error("contact_form lead capture failed:", err);
      }
    });

    // Send confirmation to the client
    const { error: confirmError } = await resend.emails.send({
      from: "Swift Designz <noreply@swiftdesignz.co.za>",
      to: [email],
      subject: "We've received your enquiry - Swift Designz",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #101010; color: #e0e0e0; padding: 40px; border-radius: 16px; border: 1px solid rgba(48, 176, 176, 0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://swiftdesignz.co.za/images/logo.png" alt="Swift Designz" style="height: 60px; width: auto; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #30B0B0; font-size: 24px; margin: 0;">Thank You, ${escapeHtml(name)}!</h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #30B0B0, transparent); margin: 12px auto;"></div>
          </div>
          
          <p style="color: #ccc; line-height: 1.7; font-size: 14px;">
            We've received your project enquiry and we're excited to learn more about what you have in mind.
          </p>
          <p style="color: #ccc; line-height: 1.7; font-size: 14px;">
            A member of our team will get back to you within <strong style="color: #30B0B0;">24 hours</strong> with a response.
          </p>
          <p style="color: #ccc; line-height: 1.7; font-size: 14px;">
            In the meantime, feel free to browse our <a href="https://swiftdesignz.co.za/portfolio" style="color: #30B0B0; text-decoration: none;">portfolio</a> or check out our <a href="https://swiftdesignz.co.za/packages" style="color: #30B0B0; text-decoration: none;">packages</a>.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">Swift Designz - Crafting Digital Excellence</p>
            <p style="color: #555; font-size: 11px; margin: 4px 0 0 0;">info@swiftdesignz.co.za</p>
          </div>
        </div>
      `,
    });
    if (confirmError) {
      console.error("Contact client confirmation error:", JSON.stringify(confirmError));
      return NextResponse.json({ success: true, confirmationSent: false });
    }

    return NextResponse.json({ success: true, confirmationSent: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Our messenger hit a bump on the way out. Take a breath and try again in a moment!" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
