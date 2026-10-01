import { NextRequest, NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  // A plain insert, not an upsert. PostgREST's upsert path needs more than the INSERT
  // privilege the anonymous role has, so it is refused by RLS even with
  // ignoreDuplicates - verified against production. A duplicate email is therefore
  // handled here instead: signing up twice is a no-op, not an error the visitor sees.
  const { error } = await supabasePublic.from("newsletter_subscribers").insert({
    email: email.toLowerCase().trim(),
    name: name?.trim() || null,
    source: "public_form",
    status: "active",
  });

  // 23505 is unique_violation: already subscribed, which is a success from the
  // visitor's point of view.
  if (error && error.code === "23505") {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  if (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
