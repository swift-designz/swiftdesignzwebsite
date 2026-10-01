import { NextRequest, NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  // ignoreDuplicates, so this is INSERT ... ON CONFLICT DO NOTHING. An update would need
  // an UPDATE policy the anonymous role does not have, and a public form has no business
  // overwriting an existing subscriber's record anyway. Signing up twice is a no-op.
  const { error } = await supabasePublic.from("newsletter_subscribers").upsert(
    {
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      source: "public_form",
      status: "active",
    },
    { onConflict: "email", ignoreDuplicates: true }
  );

  if (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
