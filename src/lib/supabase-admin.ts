import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for the public website.
 *
 * This used the service-role key, which bypasses row level security entirely, in order
 * to insert a single newsletter row. A public marketing site does not need unrestricted
 * access to the live business database, so it uses the publishable key and relies on the
 * `public_insert` policy on `newsletter_subscribers`, which permits an anonymous insert
 * where `status = 'active'` and `source = 'public_form'`.
 *
 * The key also has to be current: the service-role key configured here predated the
 * 29 June 2026 rotation that disabled every legacy key project-wide, so newsletter
 * signup had been returning 500 since.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabasePublic = createClient(url, key, {
  auth: { persistSession: false },
});
